<?php

declare(strict_types=1);

namespace App\Services;

use App\Adapters\JiraAdapter;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TaskMeta;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

final readonly class JiraService
{
    public function __construct(public JiraAdapter $jiraAdapter) {}

    /**
     * Helper method for error responses.
     */
    public function errorResponse(string $message, int $status): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }

    /**
     * Retrieve stored Jira credentials or return an error response if missing.
     *
     * @param  string|null  $notFoundMessage  Custom message when credentials are missing
     */
    public function getCredentialsOrError(?string $notFoundMessage = null): array|JsonResponse
    {
        $credentials = $this->jiraAdapter->getJiraCredentials();

        if (! $credentials) {
            return $this->errorResponse($notFoundMessage ?? 'Jira credentials not found.', 400);
        }

        return $credentials;
    }

    /**
     * Import Jira issues as tasks.
     *
     * @param  array  $credentials  The Jira credentials
     * @param  string  $projectKey  The Jira project key
     * @param  Project  $project  The local project
     * @return array{new_tasks:int,updated_tasks:int}
     *
     * @throws Exception
     */
    public function importIssuesAsTasks(array $credentials, string $projectKey, Project $project): array
    {
        $domain = $credentials['domain'];
        $email = $credentials['email'];
        $token = $credentials['token'];

        $issues = $this->jiraAdapter->getProjectIssues($domain, $email, $token, $projectKey);

        if ($issues instanceof JsonResponse) {
            $error = $issues->getContent();
            throw new Exception('Failed to fetch Jira issues: ' . $error);
        }

        $stats = [
            'new_tasks' => 0,
            'updated_tasks' => 0,
        ];

        foreach ($issues as $issue) {
            /** @var TaskMeta|null $existingTaskMeta */
            $existingTaskMeta = TaskMeta::query()
                ->where('source', 'jira')
                ->where('source_id', $issue['key'])
                ->first();

            $fields = $issue['fields'];
            $issueUrl = $this->jiraAdapter->getJiraBrowserUrl($domain, $issue['key']);
            $taskData = $this->prepareTaskDataFromJiraIssue($fields);
            $metaData = $this->prepareTaskMetaFromJiraIssue($issue, $fields, $issueUrl);

            if ($existingTaskMeta) {
                /** @var Task|null $task */
                $task = Task::query()->find($existingTaskMeta->task_id);
                if ($task) {
                    $updateData = $taskData;
                    if ($task->created_by === null) {
                        $updateData['created_by'] = $project->user_id;
                    }
                    $task->update($updateData);
                    $existingTaskMeta->update($metaData);
                    $stats['updated_tasks']++;
                }
            } else {
                $task = new Task();
                $task->fill($taskData);
                $task->project_id = $project->id;
                $task->is_imported = true;
                $task->created_by = $project->user_id;
                $task->save();

                $metaData['source'] = 'jira';
                $task->meta()->create($metaData);

                if (isset($fields['labels']) && is_array($fields['labels'])) {
                    foreach ($fields['labels'] as $label) {
                        $tag = Tag::query()->firstOrCreate([
                            'name' => $label,
                            'user_id' => Auth::id(),
                        ]);
                        $task->tags()->attach($tag->id);
                    }
                }

                $stats['new_tasks']++;
            }
        }

        return $stats;
    }

    /**
     * Prepare task data from Jira issue fields
     *
     * @param  array  $fields  The Jira issue fields
     * @return array{
     *     title:string,
     *     description: ?string,
     *     status:string,
     *     priority:string,
     *     due_date: ?string
     * }
     */
    private function prepareTaskDataFromJiraIssue(array $fields): array
    {
        return [
            'title' => $fields['summary'],
            'description' => $this->extractJiraDescription($fields['description'] ?? []),
            'status' => $this->mapJiraStatusToLocal($fields['status']['name'] ?? ''),
            'priority' => $this->mapJiraPriorityToLocal($fields['priority']['name'] ?? ''),
            'due_date' => isset($fields['duedate']) ? Carbon::parse($fields['duedate'])->format('Y-m-d') : null,
        ];
    }

    /**
     * Extract text from Jira's Atlassian Document Format.
     *
     * @param  array|string|null  $description  The Jira description field
     */
    private function extractJiraDescription(array|string|null $description): ?string
    {
        if ($description === '' || $description === '0' || $description === [] || $description === null) {
            return null;
        }

        if (is_string($description)) {
            return $description;
        }

        if (isset($description['content'])) {
            $text = '';

            foreach ($description['content'] as $block) {
                if (isset($block['content'])) {
                    foreach ($block['content'] as $content) {
                        if (isset($content['text'])) {
                            $text .= $content['text'] . "\n";
                        }
                    }
                }
            }

            return mb_trim($text);
        }

        return null;
    }

    /**
     * Map Jira status to local status.
     */
    private function mapJiraStatusToLocal(string $jiraStatus): string
    {
        return match (mb_strtolower($jiraStatus)) {
            'in progress' => 'in_progress',
            'done', 'closed', 'resolved' => 'completed',
            default => 'pending',
        };
    }

    /**
     * Map Jira priority to local priority.
     */
    private function mapJiraPriorityToLocal(string $jiraPriority): string
    {
        return match (mb_strtolower($jiraPriority)) {
            'highest', 'high' => 'high',
            'low', 'lowest' => 'low',
            default => 'medium',
        };
    }

    /**
     * Prepare task meta data from Jira issue
     *
     * @param  array  $issue  The Jira issue
     * @param  array  $fields  The Jira issue fields
     * @param  string  $issueUrl  The issue URL
     * @return array<string, mixed>
     */
    private function prepareTaskMetaFromJiraIssue(array $issue, array $fields, string $issueUrl): array
    {
        return [
            'source_id' => $issue['key'],
            'source_number' => $issue['id'] ?? null,
            'source_url' => $issueUrl,
            'source_state' => $fields['status']['name'] ?? null,
            'extra_data' => [
                'updated_at' => $fields['updated'] ?? null,
                'created_at' => $fields['created'] ?? null,
                'reporter' => $fields['reporter']['displayName'] ?? null,
                'assignee' => $fields['assignee']['displayName'] ?? null,
                'issue_type' => $fields['issuetype']['name'] ?? null,
            ],
        ];
    }
}
