<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\JiraAdapter;
use App\Http\Requests\JiraCredentialsRequest;
use App\Http\Requests\JiraProjectImportRequest;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TaskMeta;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;

final class JiraController extends Controller
{
    public function __construct(private readonly JiraAdapter $jiraAdapter) {}

    /**
     * Display the Jira connection page.
     */
    public function connect(): Response
    {
        return Inertia::render('jira/connect');
    }

    /**
     * Display the Jira projects page.
     */
    public function index(): Response
    {
        return Inertia::render('jira/projects');
    }

    /**
     * Test and save Jira credentials.
     */
    public function storeCredentials(JiraCredentialsRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            $domain = $validatedData['domain'];
            $email = $validatedData['email'];
            $token = $validatedData['token'];

            if (! $this->jiraAdapter->testCredentials($domain, $email, $token)) {
                return $this->errorResponse('Invalid Jira credentials. Please check your domain, email, and API token.', 400);
            }

            $this->jiraAdapter->saveJiraCredentials($domain, $email, $token);

            return response()->json([
                'success' => true,
                'message' => 'Jira credentials validated and saved successfully.',
            ]);
        } catch (Exception $e) {
            Log::error('Error saving Jira credentials: ' . $e->getMessage());

            return $this->errorResponse('Failed to save Jira credentials: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get Jira projects using the stored credentials.
     */
    public function getProjects(): JsonResponse
    {
        try {
            $credentials = $this->jiraAdapter->getJiraCredentials();

            if (! $credentials) {
                return $this->errorResponse('Jira credentials not found. Please set up your Jira credentials first.', 400);
            }

            $projects = $this->jiraAdapter->getProjects(
                $credentials['domain'],
                $credentials['email'],
                $credentials['token']
            );

            $importedProjectKeys = Project::query()
                ->where('source', 'jira')
                ->pluck('repo_id')
                ->toArray();

            return response()->json([
                'success' => true,
                'projects' => $projects,
                'importedProjectKeys' => $importedProjectKeys,
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching Jira projects: ' . $e->getMessage());

            return $this->errorResponse('Failed to fetch Jira projects: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Import a Jira project.
     */
    public function importProject(JiraProjectImportRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $credentials = $this->jiraAdapter->getJiraCredentials();

            if (! $credentials) {
                return $this->errorResponse('Jira credentials not found. Please set up your Jira credentials first.', 400);
            }

            if (Project::query()->where('source', 'jira')
                ->where('repo_id', $validatedData['key'])
                ->exists()) {
                return $this->errorResponse('This Jira project has already been imported.', 400);
            }

            $project = new Project();
            $project->name = $validatedData['name'];
            $project->description = $validatedData['description'] ?? null;
            $project->source = 'jira';
            $project->repo_id = $validatedData['key'];
            $project->user_id = Auth::id();
            $project->save();

            $this->importIssuesAsTasks($credentials, $validatedData['key'], $project);

            return response()->json([
                'success' => true,
                'message' => 'Jira project and its issues successfully imported',
                'id' => $project->getKey(),
            ]);
        } catch (Exception $e) {
            Log::error('Error importing Jira project: ' . $e->getMessage());

            return $this->errorResponse('Failed to import Jira project: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Sync a Jira project and its issues.
     *
     * @param  Project  $project  The project to sync
     * @return JsonResponse The response
     */
    #[Action(method: 'post', name: 'jira.projects.sync', params: ['project'])]
    public function syncProject(Project $project): JsonResponse
    {
        try {
            if ($project->source !== 'jira' || ! $project->repo_id) {
                return $this->errorResponse('This project is not a Jira project.', 400);
            }

            $credentials = $this->jiraAdapter->getJiraCredentials();
            if (! $credentials) {
                return $this->errorResponse('Jira credentials not found for this project.', 400);
            }

            $result = $this->importIssuesAsTasks($credentials, $project->repo_id, $project);

            return response()->json([
                'success' => true,
                'message' => 'Jira project and issues successfully synced',
                'new_tasks' => $result['new_tasks'],
                'updated_tasks' => $result['updated_tasks'],
            ]);
        } catch (Exception $e) {
            Log::error('Error syncing Jira project: ' . $e->getMessage());

            return $this->errorResponse('Failed to sync Jira project: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Helper method for error responses.
     *
     * @param  string  $message  The error message
     * @param  int  $status  The HTTP status code
     * @return JsonResponse The error response
     */
    private function errorResponse(string $message, int $status): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }

    /**
     * Helper method to import Jira issues as tasks.
     *
     * @param  array  $credentials  The Jira credentials
     * @param  string  $projectKey  The Jira project key
     * @param  Project  $project  The local project
     * @return array Import statistics
     *
     * @throws Exception
     */
    private function importIssuesAsTasks(array $credentials, string $projectKey, Project $project): array
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

            $existingTaskMeta = TaskMeta::query()
                ->where('source', 'jira')
                ->where('source_id', $issue['key'])
                ->first();

            $fields = $issue['fields'];
            $issueUrl = $this->jiraAdapter->getJiraBrowserUrl($domain, $issue['key']);
            $taskData = $this->prepareTaskDataFromJiraIssue($fields);
            $metaData = $this->prepareTaskMetaFromJiraIssue($issue, $fields, $issueUrl);

            if ($existingTaskMeta) {
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
     * @return array The prepared task data
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
     * Helper method to extract text from Jira's Atlassian Document Format.
     *
     * @param  array|string|null  $description  The Jira description field
     * @return string|null The extracted plain text
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
     *
     * @param  string  $jiraStatus  The Jira status
     * @return string The local status
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
     *
     * @param  string  $jiraPriority  The Jira priority
     * @return string The local priority
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
     * @return array The prepared task meta data
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
