<?php

declare(strict_types=1);

namespace App\Adapters;

use App\Models\Task;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

final class GitHubAdapter
{
    /**
     * Get the authenticated user's personal repositories from GitHub.
     *
     * @param  string  $token  The GitHub access token
     * @return array|JsonResponse The repositories or an error response
     */
    public function getPersonalRepositories(string $token)
    {
        return $this->makeGitHubRequest(
            $token,
            'https://api.github.com/user/repos',
            ['per_page' => 100, 'sort' => 'updated'],
            'Failed to fetch repositories from GitHub.',
            'repositories'
        );
    }

    /**
     * Get the authenticated user's organization repositories from GitHub.
     *
     * @param  string  $token  The GitHub access token
     * @return array|JsonResponse The repositories or an error response
     */
    public function getOrganizationRepositories(string $token)
    {
        $orgsResponse = $this->makeGitHubRequest(
            $token,
            'https://api.github.com/user/orgs',
            ['per_page' => 100],
            'Failed to fetch organizations from GitHub.',
            'organizations'
        );

        if ($orgsResponse instanceof JsonResponse) {
            return $orgsResponse;
        }

        $organizations = $orgsResponse;
        $allOrgRepos = [];

        foreach ($organizations as $org) {
            $reposResponse = $this->makeGitHubRequest(
                $token,
                "https://api.github.com/orgs/{$org['login']}/repos",
                ['per_page' => 100, 'sort' => 'updated'],
                null,
                null,
                false
            );

            if ($reposResponse && ! ($reposResponse instanceof JsonResponse)) {
                $repos = $reposResponse;
                foreach ($repos as $repo) {
                    $repo['organization'] = $org['login'];
                    $allOrgRepos[] = $repo;
                }
            }
        }

        return $allOrgRepos;
    }

    /**
     * Redirect the user to the GitHub authentication page.
     */
    public function redirectToGitHub(): RedirectResponse
    {
        return Socialite::driver('github')
            ->scopes(['repo', 'read:org', 'user:email'])
            ->redirect();
    }

    /**
     * Handle the GitHub callback and authenticate the user.
     *
     * @return array{user: User, token: string}
     *
     * @throws Exception
     */
    public function handleGitHubCallback(): array
    {
        $githubUser = Socialite::driver('github')->user();

        $user = User::query()->where('email', $githubUser->getEmail())->first();

        if (! $user) {
            $user = User::query()->create([
                'name' => $githubUser->getName(),
                'email' => $githubUser->getEmail(),
                'password' => Hash::make(bin2hex(random_bytes(16))),
                'email_verified_at' => now(),
            ]);
        }

        return [
            'user' => $user,
            'token' => $githubUser->token,
        ];
    }

    /**
     * Get issues from a GitHub repository.
     *
     * @param  string  $token  The GitHub access token
     * @param  string  $repoOwner  The repository owner (user or organization)
     * @param  string  $repoName  The repository name
     * @return array|JsonResponse The issues or an error response
     */
    public function getRepositoryIssues(string $token, string $repoOwner, string $repoName)
    {
        $url = "https://api.github.com/repos/{$repoOwner}/{$repoName}/issues";
        $params = [
            'state' => 'all', // Get both open and closed issues
            'per_page' => 100, // Maximum number of issues per page
            'sort' => 'created',
            'direction' => 'desc',
        ];

        return $this->makeGitHubRequest(
            $token,
            $url,
            $params,
            "Failed to fetch issues from GitHub repository: {$repoOwner}/{$repoName}.",
            'issues'
        );
    }

    /**
     * Close a GitHub issue using the GitHub API
     *
     * @param  Task  $task  The task containing GitHub issue information
     * @return bool Whether the issue was successfully closed
     */
    public function closeGitHubIssue(Task $task): bool
    {
        try {
            // Check if the task has the necessary metadata
            if (! $task->meta || ! $task->meta->source_url || ! $task->meta->source_number) {
                return false;
            }

            // Get the authenticated user's token
            $authenticatedUser = $task->project->user;
            $token = $authenticatedUser?->github_token;

            if (! $token) {
                return false;
            }

            // Extract repository owner and name from the GitHub URL
            // GitHub issue URLs have the format: https://github.com/{owner}/{repo}/issues/{number}
            preg_match('/github\.com\/([^\/]+)\/([^\/]+)\/issues/', $task->meta->source_url, $matches);

            if (count($matches) < 3) {
                Log::error('Invalid GitHub issue URL format', [
                    'task_id' => $task->id,
                    'url' => $task->meta->source_url,
                ]);

                return false;
            }

            $repoOwner = $matches[1];
            $repoName = $matches[2];
            $issueNumber = $task->meta->source_number;

            // Update the issue state to closed
            $response = Http::withToken($token)
                ->patch("https://api.github.com/repos/{$repoOwner}/{$repoName}/issues/{$issueNumber}", [
                    'state' => 'closed',
                ]);

            if ($response->successful()) {
                // Update the task's metadata to reflect that the issue is now closed
                $task->meta->update(['source_state' => 'closed']);

                return true;
            }

            return false;
        } catch (Exception $e) {
            Log::error('Error closing GitHub issue:', [
                'task_id' => $task->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Create a GitHub issue for a task
     *
     * @param  Task  $task  The task to create an issue for
     * @param  string  $repoOwner  The repository owner
     * @param  string  $repoName  The repository name
     * @return bool|array False if failed, or array with issue details if successful
     */
    public function createGitHubIssue(Task $task, string $repoOwner, string $repoName)
    {
        try {
            // Get the authenticated user's token
            $authenticatedUser = $task->project->user;
            $token = $authenticatedUser?->github_token;

            if (! $token) {
                return false;
            }

            // Create the issue payload
            $payload = [
                'title' => $task->title,
                'body' => $task->description ?? '',
                'labels' => [$task->priority, $task->status],
            ];

            // Add due date as part of the body if exists
            if ($task->due_date) {
                $payload['body'] .= "\n\nDue date: " . $task->due_date->format('Y-m-d');
            }

            // Create the issue on GitHub
            $response = Http::withToken($token)
                ->post("https://api.github.com/repos/{$repoOwner}/{$repoName}/issues", $payload);

            if ($response->successful()) {
                $issueData = $response->json();

                // Create or update task metadata with GitHub issue details
                $task->meta()->updateOrCreate(
                    ['task_id' => $task->id],
                    [
                        'source' => 'github',
                        'source_owner' => $repoOwner,
                        'source_repo' => $repoName,
                        'source_number' => $issueData['number'],
                        'source_state' => $issueData['state'],
                        'source_url' => $issueData['html_url'],
                    ]
                );

                return $issueData;
            }

            return false;
        } catch (Exception $e) {
            Log::error('Error creating GitHub issue:', [
                'task_id' => $task->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Make a request to the GitHub API with error handling.
     *
     * @param  string  $token  The GitHub access token
     * @param  string  $url  The API endpoint URL
     * @param  array  $params  The query parameters
     * @param  string|null  $errorMessage  Custom error message on failure
     * @param  string|null  $resourceType  Type of resource being fetched (for error logging)
     * @param  bool  $returnErrorResponse  Whether to return an error response on failure
     * @return array|JsonResponse The response data or an error response
     */
    private function makeGitHubRequest(
        string $token,
        string $url,
        array $params = [],
        ?string $errorMessage = null,
        ?string $resourceType = null,
        bool $returnErrorResponse = true
    ) {
        try {
            $response = Http::withToken($token)->get($url, $params);

            if ($response->failed() && $returnErrorResponse) {
                $message = $errorMessage ?? 'Failed to fetch data from GitHub.';

                return response()->json(['error' => $message], 500);
            }

            return $response->successful() ? $response->json() : null;
        } catch (Exception $e) {
            Log::error("Error fetching GitHub {$resourceType}: " . $e->getMessage());

            if ($returnErrorResponse) {
                return response()->json([
                    'error' => 'An error occurred while fetching ' . ($resourceType ?? 'data') . '.',
                ], 500);
            }

            return null;
        }
    }
}
