<?php

declare(strict_types=1);

namespace App\Adapters;

use App\Models\GitHubRepository;
use App\Models\Project;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

final class GitHubAdapter
{
    /**
     * Get the authenticated user's personal repositories from GitHub.
     *
     * @param string $token The GitHub access token
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
     * @param string $token The GitHub access token
     * @return array|JsonResponse The repositories or an error response
     */
    public function getOrganizationRepositories(string $token)
    {
        try {
            // First, get the user's organizations
            $orgsResponse = Http::withToken($token)
                ->get('https://api.github.com/user/orgs', [
                    'per_page' => 100,
                ]);

            if ($orgsResponse->failed()) {
                return response()->json(['error' => 'Failed to fetch organizations from GitHub.'], 500);
            }

            $organizations = $orgsResponse->json();
            $allOrgRepos = [];

            // For each organization, get its repositories
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
     * Save selected repositories to a project.
     *
     * @param Project $project The project to save repositories to
     * @param array $repositories The repositories to save
     * @param int $userId The ID of the user saving the repositories
     * @return array The saved repositories
     */
    public function saveRepositories(Project $project, array $repositories, int $userId): array
    {
        $savedRepos = [];

        foreach ($repositories as $repo) {
            $githubRepo = GitHubRepository::updateOrCreate(
                [
                    'user_id' => $userId,
                    'repo_id' => (string) $repo['id'],
                ],
                [
                    'project_id' => $project->id,
                    'name' => $repo['name'],
                    'full_name' => $repo['full_name'],
                    'description' => $repo['description'] ?? null,
                    'html_url' => $repo['html_url'],
                    'is_private' => $repo['private'],
                    'is_organization' => isset($repo['organization']),
                    'organization_name' => $repo['organization'] ?? null,
                ]
            );

            $savedRepos[] = $githubRepo;
        }

        return $savedRepos;
    }

    /**
     * Get repositories for a project.
     *
     * @param Project $project The project to get repositories for
     * @return array The project repositories
     */
    public function getProjectRepositories(Project $project): array
    {
        return $project->githubRepositories->toArray();
    }

    /**
     * Remove a repository.
     *
     * @param GitHubRepository $repository The repository to remove
     * @return bool True if the repository was removed successfully
     */
    public function removeRepository(GitHubRepository $repository): bool
    {
        return $repository->delete();
    }

    /**
     * Redirect the user to the GitHub authentication page.
     *
     * @return RedirectResponse
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

        // Return the user and token for the controller to handle session storage
        return [
            'user' => $user,
            'token' => $githubUser->token,
        ];
    }
}
