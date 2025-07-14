<?php

declare(strict_types=1);

namespace App\Adapters;

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

            if ($reposResponse && !($reposResponse instanceof JsonResponse)) {
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
                    'error' => 'An error occurred while fetching ' . ($resourceType ?? 'data') . '.'
                ], 500);
            }

            return null;
        }
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
}
