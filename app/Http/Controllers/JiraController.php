<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\JiraAdapter;
use App\Http\Requests\JiraCredentialsRequest;
use App\Http\Requests\JiraProjectImportRequest;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
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

            // Test the credentials
            if (! $this->jiraAdapter->testCredentials($domain, $email, $token)) {
                return $this->errorResponse('Invalid Jira credentials. Please check your domain, email, and API token.', 400);
            }

            // Save credentials to database
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

            return response()->json([
                'success' => true,
                'projects' => array_values($projects),
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

            // Check if project is already imported
            if (Project::query()->where('source', 'jira')
                ->where('repo_id', $validatedData['key'])
                ->exists()) {
                return $this->errorResponse('This Jira project has already been imported.', 400);
            }

            // Create project
            $project = new Project();
            $project->name = $validatedData['name'];
            $project->description = $validatedData['description'] ?? null;
            $project->source = 'jira';
            $project->repo_id = $validatedData['key'];
            $project->user_id = Auth::id();
            $project->save();

            // Import issues as tasks
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
            // Check if the project is a Jira project
            if ($project->source !== 'jira' || ! $project->jira_project_key) {
                return $this->errorResponse('This project is not a Jira project.', 400);
            }

            // Get credentials from the project
            $credentials = json_decode($project->jira_credentials, true);
            if (! $credentials) {
                $credentials = $this->jiraAdapter->getSessionJiraCredentials();
                if (! $credentials) {
                    return $this->errorResponse('Jira credentials not found for this project.', 400);
                }
            }

            // Import issues as tasks
            $result = $this->importIssuesAsTasks($credentials, $project->jira_project_key, $project);

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
     * Helper method to import Jira issues as tasks.
     *
     * @param  array  $credentials  The Jira credentials
     * @param  string  $projectKey  The Jira project key
     * @param  Project  $project  The local project
     * @return array Import statistics
     */
    private function importIssuesAsTasks(array $credentials, string $projectKey, Project $project): array
    {
        $domain = $credentials['domain'];
        $email = $credentials['email'];
        $token = $credentials['token'];

        $issues = $this->jiraAdapter->getProjectIssues($domain, $email, $token, $projectKey);

        if ($issues instanceof JsonResponse) {
            $error = $issues->getContent();
            Log::error('Failed to fetch Jira issues', ['error' => $error]);
            throw new Exception('Failed to fetch Jira issues: ' . $error);
        }

        $stats = [
            'new_tasks' => 0,
            'updated_tasks' => 0,
        ];

        foreach ($issues as $issue) {
            // Check if task already exists
            $existingTask = Task::query()->where('external_id', $issue['key'])
                ->where('source', 'jira')
                ->first();

            $fields = $issue['fields'];

            if ($existingTask) {
                // Update existing task
                $existingTask->update([
                    'title' => $fields['summary'],
                    'description' => $this->extractJiraDescription($fields['description'] ?? []),
                    'status' => $this->mapJiraStatusToLocal($fields['status']['name'] ?? ''),
                    'priority' => $this->mapJiraPriorityToLocal($fields['priority']['name'] ?? ''),
                    'due_date' => isset($fields['duedate']) ? Carbon::parse($fields['duedate'])->format('Y-m-d') : null,
                ]);

                $stats['updated_tasks']++;
            } else {
                // Create new task
                $task = new Task();
                $task->title = $fields['summary'];
                $task->description = $this->extractJiraDescription($fields['description'] ?? []);
                $task->status = $this->mapJiraStatusToLocal($fields['status']['name'] ?? '');
                $task->priority = $this->mapJiraPriorityToLocal($fields['priority']['name'] ?? '');
                $task->due_date = isset($fields['duedate']) ? Carbon::parse($fields['duedate'])->format('Y-m-d') : null;
                $task->external_id = $issue['key'];
                $task->source = 'jira';
                $task->project_id = $project->id;
                $task->user_id = Auth::id();
                $task->save();

                // Add labels as tags
                if (isset($fields['labels']) && is_array($fields['labels'])) {
                    foreach ($fields['labels'] as $label) {
                        $tag = Tag::query()->firstOrCreate(['name' => $label]);
                        $task->tags()->attach($tag->id);
                    }
                }

                $stats['new_tasks']++;
            }
        }

        return $stats;
    }

    /**
     * Helper method to extract text from Jira's Atlassian Document Format.
     *
     * @param  array|string|null  $description  The Jira description field
     * @return string|null The extracted plain text
     */
    private function extractJiraDescription($description): ?string
    {
        if (empty($description)) {
            return null;
        }

        // Handle string description (old Jira format)
        if (is_string($description)) {
            return $description;
        }

        // Handle Atlassian Document Format
        if (is_array($description) && isset($description['content'])) {
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
            'to do', 'open', 'backlog' => 'pending',
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
            'medium' => 'medium',
            'low', 'lowest' => 'low',
            default => 'medium',
        };
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
}
