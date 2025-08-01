<?php

declare(strict_types=1);

use App\Adapters\GitHubAdapter;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Get all users with GitHub integration (those with github_token)
        $usersWithGitHub = User::query()->whereNotNull('github_token')->get();
        $githubAdapter = app(GitHubAdapter::class);

        foreach ($usersWithGitHub as $user) {
            try {
                // Get user repositories from GitHub
                $repositories = $githubAdapter->getPersonalRepositories($user->github_token);

                if (! is_array($repositories)) {
                    Log::warning("Failed to fetch repositories for user {$user->id}");

                    continue;
                }

                // Also get organization repositories
                $orgRepositories = $githubAdapter->getOrganizationRepositories($user->github_token);
                if (is_array($orgRepositories)) {
                    $repositories = array_merge($repositories, $orgRepositories);
                }

                // Get all user's projects
                $projects = Project::query()->where('user_id', $user->id)->get();

                foreach ($repositories as $repo) {
                    // Try to find a matching project by name
                    $project = $projects->first(function ($project) use ($repo) {
                        // Compare project name with repository full_name
                        return $project->name === $repo['full_name'];
                    });

                    if ($project) {
                        // Update the project with GitHub repository data
                        $project->repo_id = $repo['id'];
                        $project->source = 'github';
                        $project->save();

                        Log::info("Updated project {$project->id} with GitHub repository ID {$repo['id']}");

                        // Now import issues from this repository
                        $this->importRepositoryIssues($githubAdapter, $user->github_token, $repo, $project);
                    }
                }
            } catch (Exception $e) {
                Log::error("Error syncing GitHub repositories for user {$user->id}: " . $e->getMessage());

                continue;
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse this migration as it just synchronizes data
    }

    /**
     * Import issues from a GitHub repository as tasks.
     */
    private function importRepositoryIssues(
        GitHubAdapter $githubAdapter,
        string $token,
        array $repository,
        Project $project
    ): void {
        try {
            // Extract owner and repo name from the full name (format: "owner/repo")
            [$repoOwner, $repoName] = explode('/', $repository['full_name']);

            // Fetch issues from GitHub repository
            $issues = $githubAdapter->getRepositoryIssues($token, $repoOwner, $repoName);

            if (! is_array($issues)) {
                Log::warning("Failed to fetch issues for repository: {$repository['full_name']}");

                return;
            }

            // Import each issue as a task
            foreach ($issues as $issue) {
                try {
                    // Skip pull requests (which are also returned by the issues API)
                    if (isset($issue['pull_request'])) {
                        continue;
                    }

                    // Skip issues that are already imported (check task_meta for this issue)
                    $existingTask = Task::query()->whereHas('meta', function ($query) use ($issue) {
                        $query->where('source', 'github')
                            ->where('source_id', (string) $issue['id']);
                    })->first();

                    if ($existingTask) {
                        continue;
                    }

                    // Map GitHub issue status to task status
                    $status = $issue['state'] === 'open' ? 'pending' : 'completed';

                    // Determine priority (simple algorithm based on labels)
                    $priority = 'medium'; // Default priority

                    if (isset($issue['labels']) && is_array($issue['labels'])) {
                        foreach ($issue['labels'] as $label) {
                            $labelName = mb_strtolower($label['name']);

                            if (str_contains($labelName, 'high') || str_contains($labelName, 'urgent')) {
                                $priority = 'high';
                                break;
                            }

                            if (str_contains($labelName, 'low')) {
                                $priority = 'low';
                                break;
                            }
                        }
                    }

                    // Create the task with is_imported flag set to true
                    $task = $project->tasks()->create([
                        'title' => $issue['title'],
                        'description' => $issue['body'] ?? '',
                        'status' => $status,
                        'priority' => $priority,
                        'is_imported' => true,
                    ]);

                    // Store GitHub-specific metadata in the tasks_meta table
                    $task->meta()->create([
                        'source' => 'github',
                        'source_id' => (string) $issue['id'],
                        'source_number' => (string) $issue['number'],
                        'source_url' => $issue['html_url'],
                        'source_state' => $issue['state'],
                        'extra_data' => [
                            'labels' => $issue['labels'] ?? [],
                            'created_at' => $issue['created_at'] ?? null,
                            'updated_at' => $issue['updated_at'] ?? null,
                            'closed_at' => $issue['closed_at'] ?? null,
                            'user' => isset($issue['user']) ? [
                                'id' => $issue['user']['id'] ?? null,
                                'login' => $issue['user']['login'] ?? null,
                            ] : null,
                        ],
                    ]);

                    Log::info("Created task from GitHub issue #{$issue['number']} for project {$project->name}");
                } catch (Exception $e) {
                    Log::error("Failed to import GitHub issue #{$issue['number']} as task: " . $e->getMessage());

                    continue; // Continue with the next issue even if one fails
                }
            }
        } catch (Exception $e) {
            Log::error("Error importing issues from repository {$repository['full_name']}: " . $e->getMessage());
        }
    }
};
