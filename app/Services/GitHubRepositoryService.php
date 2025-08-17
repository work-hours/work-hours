<?php

declare(strict_types=1);

namespace App\Services;

use App\Adapters\GitHubAdapter;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

final readonly class GitHubRepositoryService
{
    public function __construct(public GitHubAdapter $githubAdapter) {}

    /**
     * Fetch repositories from GitHub based on the specified type.
     */
    public function fetchRepositories(string $type): JsonResponse
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
     */
    public function getGitHubToken(): string|JsonResponse
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
     */
    public function createProjectFromRepository(array $data): Project
    {
        $user = Auth::user();

        return Project::query()->create([
            'user_id' => $user->getKey(),
            'name' => $data['full_name'],
            'description' => ($data['description'] ?? '') . "\n\nGitHub Repository: " . $data['html_url'],
            'repo_id' => $data['repo_id'],
            'source' => 'github',
        ]);
    }

    /**
     * Create an error JSON response.
     */
    public function errorResponse(string $message, int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'success' => false,
            'error' => $message,
        ], $statusCode);
    }

    /**
     * Check if a repository is already imported as a project.
     */
    public function isRepositoryImported(string $name): bool
    {
        return Project::query()
            ->where('name', $name)
            ->exists();
    }

    /**
     * Import GitHub issues as tasks for a project.
     */
    public function importIssuesAsTasks(string $token, string $repoOwner, string $repoName, Project $project): void
    {
        $issues = $this->getRepositoryIssues($token, $repoOwner, $repoName);

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

                continue;
            }
        }
    }

    /**
     * Sync tags for a task based on GitHub issue labels.
     */
    public function syncTagsFromGitHubLabels(array $labels, int $userId, string $status, string $priority, Task $task, bool $sync = true): void
    {
        if ($labels === []) {
            return;
        }

        $tagIds = [];

        foreach ($labels as $label) {
            if (($label['name'] ?? null) === $status) {
                continue;
            }
            if (($label['name'] ?? null) === $priority) {
                continue;
            }

            $tag = Tag::query()->firstOrCreate([
                'name' => $label['name'],
                'user_id' => $userId,
            ], [
                'color' => ($label['color'] ?? null) ? '#' . $label['color'] : Tag::generateRandomColor(),
            ]);

            $tagIds[] = $tag->getKey();
        }

        if ($tagIds === []) {
            return;
        }

        if ($sync) {
            $task->tags()->sync($tagIds);
        } else {
            $task->tags()->attach($tagIds);
        }
    }

    /**
     * Map GitHub issue state to task status.
     */
    public function mapGitHubIssueStatus(string $state): string
    {
        return match ($state) {
            'closed' => 'completed',
            default => 'pending',
        };
    }

    /**
     * Determine task priority based on GitHub issue attributes.
     */
    public function determineIssuePriority(array $issue): string
    {
        if (isset($issue['labels']) && is_array($issue['labels'])) {
            foreach ($issue['labels'] as $label) {
                $labelName = mb_strtolower((string) ($label['name'] ?? ''));

                if ($labelName === '') {
                    continue;
                }

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
    public function buildIssueExtraData(array $issue): array
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
    public function computeStatusAndPriority(array $issue): array
    {
        $status = $this->mapGitHubIssueStatus($issue['state'] ?? 'open');
        $priority = $this->determineIssuePriority($issue);

        return [$status, $priority];
    }

    /**
     * Wrapper to fetch repo issues via the adapter for convenience.
     */
    public function getRepositoryIssues(string $token, string $repoOwner, string $repoName): array|JsonResponse
    {
        return $this->githubAdapter->getRepositoryIssues($token, $repoOwner, $repoName);
    }
}
