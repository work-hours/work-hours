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
            // Get the task owner's GitHub token
            $user = User::query()->find($task->project->user_id);
            if (! $user || ! $user->github_token) {
                Log::warning('Cannot close GitHub issue: No GitHub token found for user', ['user_id' => $task->project->user_id]);

                return false;
            }

            $token = $user->github_token;
            $meta = $task->meta;

            if (! $meta || ! $meta->source_url) {
                Log::warning('Cannot close GitHub issue: Missing metadata', ['task_id' => $task->id]);

                return false;
            }

            // Parse the GitHub repository information from the issue URL
            // Example URL: https://github.com/username/repo/issues/123
            preg_match('/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/', (string) $meta->source_url, $matches);

            if (count($matches) < 4) {
                Log::warning('Cannot close GitHub issue: Invalid URL format', ['url' => $meta->source_url]);

                return false;
            }

            $owner = $matches[1];
            $repo = $matches[2];
            $issueNumber = $matches[3];

            // We need to use PATCH request to close GitHub issues
            $response = Http::withToken($token)
                ->acceptJson()
                ->patch("https://api.github.com/repos/{$owner}/{$repo}/issues/{$issueNumber}", [
                    'state' => 'closed',
                ]);

            if ($response->successful()) {
                // Update the local task metadata to reflect the closed state
                $meta->update([
                    'source_state' => 'closed',
                    'extra_data' => array_merge($meta->extra_data ?? [], [
                        'closed_at' => now()->toIso8601String(),
                        'closed_by' => auth()->user()->name,
                    ]),
                ]);

                Log::info('Successfully closed GitHub issue', [
                    'task_id' => $task->id,
                    'issue_number' => $issueNumber,
                    'repository' => "{$owner}/{$repo}",
                ]);

                return true;
            }
            Log::error('Failed to close GitHub issue', [
                'task_id' => $task->id,
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return false;
        } catch (Exception $e) {
            Log::error('Exception when closing GitHub issue', [
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
