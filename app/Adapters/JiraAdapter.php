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
        return $this->makeJiraRequest(
            $domain,
            $email,
            $token,
            self::API_BASE_URL . '/project',
            ['maxResults' => 100],
            'Failed to fetch projects from Jira.',
            'projects'
        );
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
            $jiraCredentials = $this->getJiraCredentials($task);
            if (! $jiraCredentials) {
                return false;
            }

            $domain = $jiraCredentials['domain'];
            $email = $jiraCredentials['email'];
            $token = $jiraCredentials['token'];
            $projectKey = $this->getProjectKey($task->project);

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

            if ($task->due_date) {
                $payload['fields']['duedate'] = $task->due_date->format('Y-m-d');
            }

            $response = Http::withBasicAuth($email, $token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("https://{$domain}.atlassian.net" . self::API_BASE_URL . '/issue', $payload);

            if ($response->successful()) {
                $issueKey = $response->json('key');

                // Update task with Jira issue key
                $task->update([
                    'external_id' => $issueKey,
                    'source' => 'jira',
                ]);

                return [
                    'issue_key' => $issueKey,
                    'issue_url' => "https://{$domain}.atlassian.net/browse/{$issueKey}",
                ];
            }

            Log::error('Failed to create Jira issue', [
                'task_id' => $task->id,
                'error' => $response->json(),
                'status' => $response->status(),
            ]);

            return false;
        } catch (Exception $e) {
            Log::error('Error creating Jira issue: ' . $e->getMessage(), [
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
     * Close a Jira issue.
     *
     * @param  Task  $task  The task containing Jira issue information
     * @return bool Whether the issue was successfully closed
     */
    public function closeJiraIssue(Task $task): bool
    {
        return $this->updateJiraIssueStatus($task, 'Done');
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
            $jiraCredentials = $this->getJiraCredentials($task);
            if (! $jiraCredentials) {
                return false;
            }

            $domain = $jiraCredentials['domain'];
            $email = $jiraCredentials['email'];
            $token = $jiraCredentials['token'];
            $issueKey = $task->external_id;

            // First, get available transitions for this issue
            $transitionsUrl = self::API_BASE_URL . "/issue/{$issueKey}/transitions";
            $transitionsResponse = Http::withBasicAuth($email, $token)
                ->get("https://{$domain}.atlassian.net" . $transitionsUrl);

            if (! $transitionsResponse->successful()) {
                Log::error('Failed to get Jira transitions', [
                    'task_id' => $task->id,
                    'issue_key' => $issueKey,
                    'error' => $transitionsResponse->json(),
                ]);

                return false;
            }

            $transitions = $transitionsResponse->json('transitions');
            $targetTransition = null;

            // Find the transition ID that matches our target status
            foreach ($transitions as $transition) {
                if (mb_strtolower((string) $transition['to']['name']) === mb_strtolower($status)) {
                    $targetTransition = $transition['id'];
                    break;
                }
            }

            if (! $targetTransition) {
                Log::error('No matching Jira transition found', [
                    'task_id' => $task->id,
                    'issue_key' => $issueKey,
                    'target_status' => $status,
                    'available_transitions' => $transitions,
                ]);

                return false;
            }

            // Execute the transition
            $response = Http::withBasicAuth($email, $token)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post("https://{$domain}.atlassian.net" . $transitionsUrl, [
                    'transition' => [
                        'id' => $targetTransition,
                    ],
                ]);

            return $response->successful();

        } catch (Exception $e) {
            Log::error('Error updating Jira issue status: ' . $e->getMessage(), [
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
            $response = Http::withBasicAuth($email, $token)
                ->get("https://{$domain}.atlassian.net" . self::API_BASE_URL . '/myself');

            return $response->successful();
        } catch (Exception) {
            return false;
        }
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
            $response = Http::withBasicAuth($email, $token)
                ->get("https://{$domain}.atlassian.net" . $url, $params);

            return $this->handleApiResponse($response, $errorMsg, $resourceKey, $returnErrors);
        } catch (Exception $e) {
            Log::error($errorMsg ?? 'Jira API request failed', [
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
                // Jira search endpoint returns issues in a nested structure
                return $data['issues'] ?? [];
            }

            return $data;
        }

        Log::error($errorMsg ?? 'Jira API request failed', [
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
     * Get the project key from a project.
     *
     * @param  Project  $project  The project
     * @return string The project key
     */
    private function getProjectKey(Project $project): string
    {
        // Extract Jira project key from project metadata
        if ($project->jira_project_key) {
            return $project->jira_project_key;
        }

        // Fall back to using the project key from the URL if it exists
        if ($project->source_url && str_contains($project->source_url, 'atlassian.net/browse/')) {
            $parts = explode('/browse/', $project->source_url);
            if (count($parts) > 1) {
                $keyParts = explode('-', $parts[1]);
                if (isset($keyParts[0]) && ($keyParts[0] !== '' && $keyParts[0] !== '0')) {
                    return $keyParts[0];
                }
            }
        }

        // Last resort: use a sanitized version of the project name
        return mb_strtoupper(mb_substr((string) preg_replace('/[^A-Za-z0-9]/', '', $project->name), 0, 10));
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
            'medium' => 'Medium',
            'low' => 'Low',
            default => 'Medium',
        };
    }
}
