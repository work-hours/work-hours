<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\GitHubAdapter;
use App\Http\Requests\GitRepoToProjectRequest;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;

final class GitHubRepositoryController extends Controller
{
    public function __construct(private readonly GitHubAdapter $githubAdapter) {}

    /**
     * Get the authenticated user's personal repositories from GitHub.
     */
    public function getPersonalRepositories(): JsonResponse
    {
        return $this->fetchRepositories('personal');
    }

    /**
     * Get the authenticated user's organization repositories from GitHub.
     */
    public function getOrganizationRepositories(): JsonResponse
    {
        return $this->fetchRepositories('organization');
    }

    /**
     * Display the GitHub repositories page.
     */
    public function index(): Response
    {
        return Inertia::render('github/repositories');
    }

    /**
     * Import a GitHub repository as a project.
     */
    public function importRepository(GitRepoToProjectRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            if ($this->isRepositoryImported($validatedData['full_name'])) {
                return $this->errorResponse('Repository is already imported as a project.', 400);
            }

            $project = $this->createProjectFromRepository($validatedData);

            $token = $this->getGitHubToken();
            if (! ($token instanceof JsonResponse)) {

                [$repoOwner, $repoName] = explode('/', (string) $validatedData['full_name']);

                $this->importIssuesAsTasks($token, $repoOwner, $repoName, $project);
            }

            return response()->json([
                'success' => true,
                'message' => 'Repository and its issues successfully imported as a project with tasks',
                'id' => $project->getKey(),
            ]);
        } catch (Exception $e) {
            Log::error('Error importing GitHub repository: ' . $e->getMessage());

            return $this->errorResponse('Failed to import repository: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Sync a GitHub repository project and its issues.
     *
     * @param  Project  $project  The project to sync
     * @return JsonResponse The response
     */
    #[Action(method: 'post', name: 'github.repositories.sync', params: ['project'])]
    public function syncRepository(Project $project): JsonResponse
    {
        try {

            if ($project->source !== 'github') {
                return $this->errorResponse('This project is not a GitHub repository.', 400);
            }

            $token = $this->getGitHubToken();
            if ($token instanceof JsonResponse) {
                return $token;
            }

            [$repoOwner, $repoName] = explode('/', $project->name);

            $issues = $this->githubAdapter->getRepositoryIssues($token, $repoOwner, $repoName);

            if ($issues instanceof JsonResponse || ! is_array($issues)) {
                return $this->errorResponse("Failed to fetch issues from GitHub repository: {$repoOwner}/{$repoName}", 500);
            }

            $newCount = 0;
            $updatedCount = 0;

            foreach ($issues as $issue) {
                try {

                    if (isset($issue['pull_request'])) {
                        continue;
                    }

                    $existingTask = $project->tasks()
                        ->whereHas('meta', function ($query) use ($issue): void {
                            $query->where('source', 'github')
                                ->where('source_id', (string) $issue['id']);
                        })
                        ->first();

                    if ($existingTask) {

                        [$status, $priority] = $this->computeStatusAndPriority($issue);

                        $updateData = [
                            'title' => $issue['title'],
                            'description' => $issue['body'] ?? '',
                            'status' => $status,
                            'priority' => $priority,
                        ];

                        if ($existingTask->created_by === null) {
                            $updateData['created_by'] = $project->user_id;
                        }

                        $existingTask->update($updateData);

                        $existingTask->meta->update([
                            'source_state' => $issue['state'],
                            'source_url' => $issue['html_url'],
                            'extra_data' => $this->buildIssueExtraData($issue),
                        ]);

                        $this->syncTagsFromGitHubLabels($issue['labels'] ?? [], $project->user_id, $status, $priority, $existingTask, true);

                        $updatedCount++;
                    } else {

                        [$status, $priority] = $this->computeStatusAndPriority($issue);

                        $task = $project->tasks()->create([
                            'title' => $issue['title'],
                            'description' => $issue['body'] ?? '',
                            'status' => $status,
                            'priority' => $priority,
                            'is_imported' => true,
                            'created_by' => $project->user_id,
                        ]);

                        $task->meta()->create([
                            'source' => 'github',
                            'source_id' => (string) $issue['id'],
                            'source_number' => (string) $issue['number'],
                            'source_url' => $issue['html_url'],
                            'source_state' => $issue['state'],
                            'extra_data' => $this->buildIssueExtraData($issue),
                        ]);

                        $this->syncTagsFromGitHubLabels($issue['labels'] ?? [], $project->user_id, $status, $priority, $task, false);

                        $newCount++;
                    }
                } catch (Exception $e) {
                    Log::error("Failed to sync GitHub issue #{$issue['number']}: " . $e->getMessage());

                    continue; // Continue with the next issue even if one fails
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully synced project from GitHub. {$newCount} new issues imported, {$updatedCount} issues updated.",
                'project_id' => $project->id,
            ]);
        } catch (Exception $e) {
            Log::error('Error syncing GitHub repository: ' . $e->getMessage(), [
                'project_id' => $project->id,
                'project_name' => $project->name,
            ]);

            return $this->errorResponse('Failed to sync repository: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Fetch repositories from GitHub based on the specified type.
     *
     * @param  string  $type  The type of repositories to fetch ('personal' or 'organization')
     * @return JsonResponse The repositories or an error response
     */
    private function fetchRepositories(string $type): JsonResponse
    {
        try {
            $token = $this->getGitHubToken();

            if ($token instanceof JsonResponse) {
                return $token;
            }

            $method = $type === 'personal'
                ? 'getPersonalRepositories'
                : 'getOrganizationRepositories';

            $repositories = $this->githubAdapter->$method($token);

            if ($repositories instanceof JsonResponse) {
                return $repositories;
            }

            foreach ($repositories as &$repo) {
                $repo['is_imported'] = $this->isRepositoryImported($repo['full_name']);
            }

            return response()->json($repositories);
        } catch (Exception $e) {
            $errorContext = $type === 'personal' ? 'repositories' : 'organization repositories';
            Log::error("Error fetching GitHub {$errorContext}: " . $e->getMessage());

            return response()->json(['error' => "An error occurred while fetching {$errorContext}."], 500);
        }
    }

    /**
     * Get the authenticated user's GitHub token.
     *
     * @return string|JsonResponse The GitHub token or an error response
     */
    private function getGitHubToken()
    {
        $user = Auth::user();
        $token = $user->github_token;

        if (! $token) {
            return response()->json(['error' => 'GitHub token not found. Please authenticate with GitHub.'], 401);
        }

        return $token;
    }

    /**
     * Create a new project from repository data.
     *
     * @param  array  $data  The repository data
     * @return Project The created project
     */
    private function createProjectFromRepository(array $data): Project
    {
        $user = Auth::user();

        return Project::query()->create([
            'user_id' => $user->getKey(),
            'name' => $data['full_name'],
            'description' => $data['description'] . "\n\nGitHub Repository: " . $data['html_url'],
            'repo_id' => $data['repo_id'],
            'source' => 'github',
        ]);
    }

    /**
     * Create an error JSON response.
     *
     * @param  string  $message  The error message
     * @param  int  $statusCode  The HTTP status code
     * @return JsonResponse The error response
     */
    private function errorResponse(string $message, int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => $message,
        ], $statusCode);
    }

    /**
     * Check if a repository is already imported as a project.
     *
     * @param  string  $name  The GitHub repository name
     * @return bool True if the repository is already imported, false otherwise
     */
    private function isRepositoryImported(string $name): bool
    {
        return Project::query()
            ->where('name', $name)
            ->exists();
    }

    /**
     * Import GitHub issues as tasks for a project.
     *
     * @param  string  $token  The GitHub access token
     * @param  string  $repoOwner  The repository owner (user or organization)
     * @param  string  $repoName  The repository name
     * @param  Project  $project  The project to associate tasks with
     */
    private function importIssuesAsTasks(string $token, string $repoOwner, string $repoName, Project $project): void
    {

        $issues = $this->githubAdapter->getRepositoryIssues($token, $repoOwner, $repoName);

        if ($issues instanceof JsonResponse || ! is_array($issues)) {
            Log::warning("Failed to fetch issues for repository: {$repoOwner}/{$repoName}");

            return;
        }

        foreach ($issues as $issue) {
            try {

                if (isset($issue['pull_request'])) {
                    continue;
                }

                [$status, $priority] = $this->computeStatusAndPriority($issue);

                $task = $project->tasks()->create([
                    'title' => $issue['title'],
                    'description' => $issue['body'] ?? '',
                    'status' => $status,
                    'priority' => $priority,
                    'is_imported' => true,
                    'created_by' => $project->user_id,
                ]);

                $task->meta()->create([
                    'source' => 'github',
                    'source_id' => (string) $issue['id'],
                    'source_number' => (string) $issue['number'],
                    'source_url' => $issue['html_url'],
                    'source_state' => $issue['state'],
                    'extra_data' => $this->buildIssueExtraData($issue),
                ]);

                $this->syncTagsFromGitHubLabels($issue['labels'] ?? [], $project->user_id, $status, $priority, $task, false);

                Log::info("Created task from GitHub issue #{$issue['number']} for project {$project->name}");
            } catch (Exception $e) {
                Log::error("Failed to import GitHub issue #{$issue['number']} as task: " . $e->getMessage());

                continue; // Continue with the next issue even if one fails
            }
        }
    }

    /**
     * Sync tags for a task based on GitHub issue labels.
     *
     * @param  array  $labels  GitHub issue labels
     * @param  int  $userId  User ID for tag ownership
     * @param  string  $status  Task status (to skip status labels)
     * @param  string  $priority  Task priority (to skip priority labels)
     * @param  Task  $task  The task to sync tags with
     * @param  bool  $sync  Whether to sync (true) or just attach (false)
     */
    private function syncTagsFromGitHubLabels(array $labels, int $userId, string $status, string $priority, Task $task, bool $sync = true): void
    {
        if ($labels !== []) {
            $tagIds = [];

            foreach ($labels as $label) {

                if ($label['name'] === $status) {
                    continue;
                }
                if ($label['name'] === $priority) {
                    continue;
                }
                $tag = Tag::query()->firstOrCreate([
                    'name' => $label['name'],
                    'user_id' => $userId,
                ], [
                    'color' => $label['color'] ? '#' . $label['color'] : Tag::generateRandomColor(),
                ]);

                $tagIds[] = $tag->getKey();
            }

            if ($tagIds !== []) {
                if ($sync) {
                    $task->tags()->sync($tagIds);
                } else {
                    $task->tags()->attach($tagIds);
                }
            }
        }
    }

    /**
     * Map GitHub issue state to task status.
     *
     * @param  string  $state  The GitHub issue state
     * @return string The corresponding task status
     */
    private function mapGitHubIssueStatus(string $state): string
    {
        return match ($state) {
            'closed' => 'completed',
            default => 'pending',
        };
    }

    /**
     * Determine task priority based on GitHub issue attributes.
     *
     * @param  array  $issue  The GitHub issue data
     * @return string The priority for the task
     */
    private function determineIssuePriority(array $issue): string
    {
        if (isset($issue['labels']) && is_array($issue['labels'])) {
            foreach ($issue['labels'] as $label) {
                $labelName = mb_strtolower((string) $label['name']);

                if (str_contains($labelName, 'high') || str_contains($labelName, 'urgent')) {
                    return 'high';
                }

                if (str_contains($labelName, 'medium')) {
                    return 'medium';
                }

                return 'low';
            }
        }

        return 'Medium';
    }

    /**
     * Build the extra_data array for a task meta from a GitHub issue payload.
     */
    private function buildIssueExtraData(array $issue): array
    {
        return [
            'labels' => $issue['labels'] ?? [],
            'created_at' => $issue['created_at'] ?? null,
            'updated_at' => $issue['updated_at'] ?? null,
            'closed_at' => $issue['closed_at'] ?? null,
            'user' => isset($issue['user']) ? [
                'id' => $issue['user']['id'] ?? null,
                'login' => $issue['user']['login'] ?? null,
            ] : null,
        ];
    }

    /**
     * Compute status and priority for a given GitHub issue payload.
     *
     * @return array{0:string,1:string}
     */
    private function computeStatusAndPriority(array $issue): array
    {
        $status = $this->mapGitHubIssueStatus($issue['state'] ?? 'open');
        $priority = $this->determineIssuePriority($issue);

        return [$status, $priority];
    }
}
