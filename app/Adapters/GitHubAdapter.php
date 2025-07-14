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
        try {
            $response = Http::withToken($token)
                ->get('https://api.github.com/user/repos', [
                    'per_page' => 100,
                    'sort' => 'updated',
                ]);

            if ($response->failed()) {
                return response()->json(['error' => 'Failed to fetch repositories from GitHub.'], 500);
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while fetching repositories.'], 500);
        }
    }

    /**
     * Get the authenticated user's organization repositories from GitHub.
     *
     * @param  string  $token  The GitHub access token
     * @return array|JsonResponse The repositories or an error response
     */
    public function getOrganizationRepositories(string $token)
    {
        try {
            $orgsResponse = Http::withToken($token)
                ->get('https://api.github.com/user/orgs', [
                    'per_page' => 100,
                ]);

            if ($orgsResponse->failed()) {
                return response()->json(['error' => 'Failed to fetch organizations from GitHub.'], 500);
            }

            $organizations = $orgsResponse->json();
            $allOrgRepos = [];

            foreach ($organizations as $org) {
                $reposResponse = Http::withToken($token)
                    ->get("https://api.github.com/orgs/{$org['login']}/repos", [
                        'per_page' => 100,
                        'sort' => 'updated',
                    ]);

                if ($reposResponse->successful()) {
                    $repos = $reposResponse->json();
                    foreach ($repos as $repo) {
                        $repo['organization'] = $org['login'];
                        $allOrgRepos[] = $repo;
                    }
                }
            }

            return $allOrgRepos;
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while fetching organization repositories.'], 500);
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
