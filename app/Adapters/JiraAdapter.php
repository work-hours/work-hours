<?php

declare(strict_types=1);

namespace App\Adapters;

use App\Models\Credential;
use App\Models\Project;
use App\Models\Task;
use Exception;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class JiraAdapter
{
    private const string API_BASE_URL = '/rest/api/3';

    /**
     * Get the user's Jira projects.
     *
     * @param  string  $domain  The Jira domain
     * @param  string  $email  The Jira user email
     * @param  string  $token  The Jira API token
     * @return array|JsonResponse The projects or an error response
     */
    public function getProjects(string $domain, string $email, string $token): array|JsonResponse
    {
        $projects = $this->makeJiraRequest(
            $domain,
            $email,
            $token,
            self::API_BASE_URL . '/project',
            ['maxResults' => 100],
            'Failed to fetch projects from Jira.',
            'projects'
        );

        Log::debug('Fetching projects from Jira.');
        Log::debug($projects);

        return $projects;
    }

    /**
     * Get issues from a Jira project.
     *
     * @param  string  $domain  The Jira domain
     * @param  string  $email  The Jira user email
     * @param  string  $token  The Jira API token
     * @param  string  $projectKey  The project key
     * @return array|JsonResponse The issues or an error response
     */
    public function getProjectIssues(string $domain, string $email, string $token, string $projectKey): array|JsonResponse
    {
        $jql = "project = {$projectKey} ORDER BY created DESC";
        $url = self::API_BASE_URL . '/search';
        $params = [
            'jql' => $jql,
            'maxResults' => 100,
        ];

        return $this->makeJiraRequest(
            $domain,
            $email,
            $token,
            $url,
            $params,
            "Failed to fetch issues from Jira project: {$projectKey}.",
            'issues'
        );
    }

    /**
     * Create a Jira issue for a task.
     *
     * @param  Task  $task  The task to create an issue for
     * @return bool|array False if failed, or array with issue details if successful
     */
    public function createJiraIssue(Task $task): bool|array
    {
        try {
            $credentials = $this->getJiraCredentials($task->project->user_id);
            if (! $credentials) {
                return false;
            }

            $projectKey = $task->project->repo_id;

            $payload = [
                'fields' => [
                    'project' => [
                        'key' => $projectKey,
                    ],
                    'summary' => $task->title,
                    'description' => [
                        'type' => 'doc',
                        'version' => 1,
                        'content' => [
                            [
                                'type' => 'paragraph',
                                'content' => [
                                    [
                                        'type' => 'text',
                                        'text' => $task->description ?? '',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'issuetype' => [
                        'name' => 'Task',
                    ],
                    'priority' => [
                        'name' => $this->mapPriorityToJira($task->priority),
                    ],
                ],
            ];

            if ($task->tags && $task->tags->isNotEmpty()) {
                $payload['fields']['labels'] = $task->tags->pluck('name')->toArray();
            }

            if ($task->due_date) {
                $payload['fields']['duedate'] = $task->due_date->format('Y-m-d');
            }

            $response = $this->makeAuthenticatedRequest(
                $credentials,
                'post',
                self::API_BASE_URL . '/issue',
                $payload
            );

            if ($response->successful()) {
                $issueKey = $response->json('key');

                $task->update(['is_imported' => true]);
                $task->meta()->updateOrCreate(
                    ['task_id' => $task->id],
                    [
                        'source' => 'jira',
                        'source_number' => $issueKey,
                        'source_state' => 'To Do',
                        'source_url' => $this->getJiraUrl($credentials['domain'], "browse/{$issueKey}"),
                        'source_id' => $issueKey,
                        'extra_data' => $response->json(),
                    ]
                );

                return [
                    'issue_key' => $issueKey,
                    'issue_url' => $this->getJiraUrl($credentials['domain'], "browse/{$issueKey}"),
                ];
            }

            $this->logError('Failed to create Jira issue', [
                'task_id' => $task->id,
                'error' => $response->json(),
                'status' => $response->status(),
            ]);

            return false;
        } catch (Exception $e) {
            $this->logError('Error creating Jira issue: ' . $e->getMessage(), [
                'task_id' => $task->id,
                'exception' => $e,
            ]);

            return false;
        }
    }

    /**
     * Get Jira credentials from the database.
     *
     * @param  int|null  $userId  The user ID (defaults to current authenticated user)
     * @return array|null The Jira credentials or null if not found
     */
    public function getJiraCredentials(?int $userId = null): ?array
    {
        $userId ??= auth()->id();

        if (! $userId) {
            return null;
        }

        $credential = Credential::query()->where('user_id', $userId)
            ->where('source', 'jira')
            ->first();

        return $credential?->keys;
    }

    /**
     * Update a Jira issue status.
     *
     * @param  Task  $task  The task containing Jira issue information
     * @param  string  $status  The status to update to
     * @return bool Whether the issue was successfully updated
     */
    public function updateJiraIssueStatus(Task $task, string $status): bool
    {
        try {
            $credentials = $this->getJiraCredentials($task->project->user_id);
            if (! $credentials) {
                return false;
            }

            $issueKey = $task->meta->source_id;
            $transitionsUrl = self::API_BASE_URL . "/issue/{$issueKey}/transitions";

            $transitionsResponse = $this->makeAuthenticatedRequest(
                $credentials,
                'get',
                $transitionsUrl
            );

            if (! $transitionsResponse->successful()) {
                $this->logError('Failed to get Jira transitions', [
                    'task_id' => $task->id,
                    'issue_key' => $issueKey,
                    'error' => $transitionsResponse->json(),
                ]);

                return false;
            }

            $transitions = $transitionsResponse->json('transitions');
            $targetTransition = null;

            foreach ($transitions as $transition) {
                if (mb_strtolower((string) $transition['to']['name']) === mb_strtolower($status)) {
                    $targetTransition = $transition['id'];
                    break;
                }
            }

            if (! $targetTransition) {
                $this->logError('No matching Jira transition found', [
                    'task_id' => $task->id,
                    'issue_key' => $issueKey,
                    'target_status' => $status,
                    'available_transitions' => $transitions,
                ]);

                return false;
            }

            $response = $this->makeAuthenticatedRequest(
                $credentials,
                'post',
                $transitionsUrl,
                [
                    'transition' => [
                        'id' => $targetTransition,
                    ],
                ]
            );

            return $response->successful();
        } catch (Exception $e) {
            $this->logError('Error updating Jira issue status: ' . $e->getMessage(), [
                'task_id' => $task->id,
                'exception' => $e,
            ]);

            return false;
        }
    }

    /**
     * Mark a Jira issue as Done.
     *
     * @param  Task  $task  The task containing Jira issue information
     * @return bool Whether the issue was successfully marked as Done
     */
    public function markIssueDone(Task $task): bool
    {
        try {
            if (! $task->meta || $task->meta->source !== 'jira' || ! $task->meta->source_id) {
                return false;
            }

            $updated = $this->updateJiraIssueStatus($task, 'Done');

            if ($updated) {
                $task->meta->update(['source_state' => 'Done']);
            }

            return $updated;
        } catch (Exception $e) {
            $this->logError('Error marking Jira issue as done: ' . $e->getMessage(), [
                'task_id' => $task->id,
                'exception' => $e,
            ]);

            return false;
        }
    }

    /**
     * Save Jira credentials to the database.
     *
     * @param  string  $domain  The Jira domain
     * @param  string  $email  The Jira user email
     * @param  string  $token  The Jira API token
     * @param  int|null  $userId  The user ID (defaults to current authenticated user)
     */
    public function saveJiraCredentials(string $domain, string $email, string $token, ?int $userId = null): void
    {
        Credential::query()->updateOrCreate([
            'user_id' => $userId ?? auth()->id(),
            'source' => 'jira',
        ], [
            'keys' => [
                'domain' => $domain,
                'email' => $email,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Delete Jira credentials from the database.
     *
     * @param  int|null  $userId  The user ID (defaults to current authenticated user)
     * @return bool Whether the credentials were deleted
     */
    public function deleteJiraCredentials(?int $userId = null): bool
    {
        $userId ??= auth()->id();

        if (! $userId) {
            return false;
        }

        return (bool) Credential::query()->where('user_id', $userId)
            ->where('source', 'jira')
            ->delete();
    }

    /**
     * Test Jira credentials.
     *
     * @param  string  $domain  The Jira domain
     * @param  string  $email  The Jira user email
     * @param  string  $token  The Jira API token
     * @return bool Whether the credentials are valid
     */
    public function testCredentials(string $domain, string $email, string $token): bool
    {
        try {
            $credentials = ['domain' => $domain, 'email' => $email, 'token' => $token];
            $response = $this->makeAuthenticatedRequest($credentials, 'get', self::API_BASE_URL . '/myself');

            return $response->successful();
        } catch (Exception) {
            return false;
        }
    }

    public function getJiraBrowserUrl(string $domain, string $path): string
    {
        return $this->getJiraUrl($domain, "browse/{$path}");
    }

    /**
     * Update a Jira issue for a task.
     *
     * @param  Task  $task  The task containing updated information
     * @return bool Whether the issue was successfully updated
     */
    public function updateJiraIssue(Task $task): bool
    {
        try {
            if (! $task->meta || $task->meta->source !== 'jira' || ! $task->meta->source_id) {
                return false;
            }

            $credentials = $this->getJiraCredentials($task->project->user_id);
            if (! $credentials) {
                return false;
            }

            $issueKey = $task->meta->source_id;

            $payload = [
                'fields' => [
                    'summary' => $task->title,
                    'description' => [
                        'type' => 'doc',
                        'version' => 1,
                        'content' => [
                            [
                                'type' => 'paragraph',
                                'content' => [
                                    [
                                        'type' => 'text',
                                        'text' => $task->description ?? '',
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'priority' => [
                        'name' => $this->mapPriorityToJira($task->priority),
                    ],
                ],
            ];

            if ($task->tags && $task->tags->isNotEmpty()) {
                $payload['fields']['labels'] = $task->tags->pluck('name')->toArray();
            }

            if ($task->due_date) {
                $payload['fields']['duedate'] = $task->due_date->format('Y-m-d');
            }

            $response = $this->makeAuthenticatedRequest(
                $credentials,
                'put',
                self::API_BASE_URL . '/issue/' . $issueKey,
                $payload
            );

            $jiraStatus = $this->mapStatusToJira($task->status);
            if ($task->meta->source_state !== $jiraStatus) {
                $this->updateJiraIssueStatus($task, $jiraStatus);
                $task->meta->update(['source_state' => $jiraStatus]);
            }

            if ($response->successful()) {
                return true;
            }

            $this->logError('Failed to update Jira issue', [
                'task_id' => $task->id,
                'issue_key' => $issueKey,
                'error' => $response->json(),
                'status' => $response->status(),
            ]);

            return false;
        } catch (Exception $e) {
            $this->logError('Error updating Jira issue: ' . $e->getMessage(), [
                'task_id' => $task->id,
                'exception' => $e,
            ]);

            return false;
        }
    }

    /**
     * Delete a Jira issue linked to a task.
     *
     * @param  Task  $task  The task containing Jira issue information
     * @return bool Whether the issue was successfully deleted
     */
    public function deleteJiraIssue(Task $task): bool
    {
        try {
            if (! $task->meta || $task->meta->source !== 'jira' || ! $task->meta->source_id) {
                return false;
            }

            $credentials = $this->getJiraCredentials($task->project->user_id);
            if (! $credentials) {
                return false;
            }

            $issueKey = $task->meta->source_id;

            $response = $this->makeAuthenticatedRequest(
                $credentials,
                'delete',
                self::API_BASE_URL . '/issue/' . $issueKey
            );

            if ($response->successful()) {
                return true;
            }

            $this->logError('Failed to delete Jira issue', [
                'task_id' => $task->id,
                'issue_key' => $issueKey,
                'error' => $response->json(),
                'status' => $response->status(),
            ]);

            return false;
        } catch (Exception $e) {
            $this->logError('Error deleting Jira issue: ' . $e->getMessage(), [
                'task_id' => $task->id,
                'exception' => $e,
            ]);

            return false;
        }
    }

    /**
     * Construct a full Jira URL.
     *
     * @param  string  $domain  The Jira domain (without .atlassian.net)
     * @param  string  $path  The path (with or without leading slash)
     * @return string The full URL
     */
    private function getJiraUrl(string $domain, string $path): string
    {
        $path = mb_ltrim($path, '/');

        return "https://{$domain}.atlassian.net/{$path}";
    }

    /**
     * Make a request to the Jira API.
     *
     * @param  string  $domain  The Jira domain
     * @param  string  $email  The Jira user email
     * @param  string  $token  The Jira API token
     * @param  string  $url  The API endpoint
     * @param  array  $params  The query parameters
     * @param  string|null  $errorMsg  The error message to log if the request fails
     * @param  string|null  $resourceKey  The key to use in the response
     * @param  bool  $returnErrors  Whether to return errors or just log them
     * @return array|JsonResponse The response data or an error response
     */
    private function makeJiraRequest(
        string $domain,
        string $email,
        string $token,
        string $url,
        array $params = [],
        ?string $errorMsg = null,
        ?string $resourceKey = null,
        bool $returnErrors = true
    ): array|JsonResponse {
        try {
            $credentials = ['domain' => $domain, 'email' => $email, 'token' => $token];
            $response = $this->makeAuthenticatedRequest($credentials, 'get', $url, null, $params);

            return $this->handleApiResponse($response, $errorMsg, $resourceKey, $returnErrors);
        } catch (Exception $e) {
            $this->logError($errorMsg ?? 'Jira API request failed', [
                'error' => $e->getMessage(),
                'url' => $url,
            ]);

            if ($returnErrors) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMsg ?? 'Failed to connect to Jira API',
                ], 500);
            }

            return [];
        }
    }

    /**
     * Handle the API response.
     *
     * @param  Response  $response  The HTTP response
     * @param  string|null  $errorMsg  The error message to log if the request fails
     * @param  string|null  $resourceKey  The key to use in the response
     * @param  bool  $returnErrors  Whether to return errors or just log them
     * @return array|JsonResponse The response data or an error response
     */
    private function handleApiResponse(
        Response $response,
        ?string $errorMsg,
        ?string $resourceKey,
        bool $returnErrors
    ): array|JsonResponse {
        if ($response->successful()) {
            $data = $response->json();

            if ($resourceKey === 'issues') {
                return $data['issues'] ?? [];
            }

            return $data;
        }

        $this->logError($errorMsg ?? 'Jira API request failed', [
            'status' => $response->status(),
            'response' => $response->json() ?? $response->body(),
        ]);

        if ($returnErrors) {
            return response()->json([
                'success' => false,
                'message' => $errorMsg ?? 'Jira API request failed',
                'details' => $response->json() ?? $response->body(),
            ], $response->status());
        }

        return [];
    }

    /**
     * Map priority from our system to Jira priority.
     *
     * @param  string  $priority  The priority in our system
     * @return string The Jira priority
     */
    private function mapPriorityToJira(string $priority): string
    {
        return match (mb_strtolower($priority)) {
            'high' => 'High',
            'low' => 'Low',
            default => 'Medium',
        };
    }

    /**
     * Map Work Hours task status to Jira status.
     *
     * @param  string  $status  The Work Hours task status
     * @return string The corresponding Jira status
     */
    private function mapStatusToJira(string $status): string
    {
        return match ($status) {
            'pending' => 'To Do',
            'in_progress' => 'In Progress',
            'completed' => 'Done',
            default => 'To Do',
        };
    }

    /**
     * Make an authenticated request to the Jira API.
     *
     * @param  array  $credentials  Associative array with domain, email and token keys
     * @param  string  $method  HTTP method (get, post, put, delete)
     * @param  string  $endpoint  The API endpoint (without domain)
     * @param  array|null  $data  Request body for POST/PUT requests
     * @param  array  $queryParams  Query parameters
     * @return Response The HTTP response
     *
     * @throws Exception
     */
    private function makeAuthenticatedRequest(
        array $credentials,
        string $method,
        string $endpoint,
        ?array $data = null,
        array $queryParams = []
    ): Response {
        $url = $this->getJiraUrl($credentials['domain'], $endpoint);

        $request = Http::withBasicAuth($credentials['email'], $credentials['token'])
            ->withHeaders(['Content-Type' => 'application/json']);

        return match ($method) {
            'get' => $request->get($url, $queryParams),
            'post' => $request->post($url, $data ?? []),
            'put' => $request->put($url, $data ?? []),
            'delete' => $request->delete($url, $data ?? []),
            default => throw new Exception("Unsupported HTTP method: {$method}"),
        };
    }

    /**
     * Log an error with consistent formatting.
     *
     * @param  string  $message  Error message
     * @param  array  $context  Additional context data
     */
    private function logError(string $message, array $context = []): void
    {
        Log::error($message, $context);
    }
}
