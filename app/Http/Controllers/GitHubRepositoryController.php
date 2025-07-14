<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\GitHubAdapter;
use App\Models\Project;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

final class GitHubRepositoryController extends Controller
{
    private GitHubAdapter $githubAdapter;

    public function __construct(GitHubAdapter $githubAdapter)
    {
        $this->githubAdapter = $githubAdapter;
    }
    /**
     * Get the authenticated user's personal repositories from GitHub.
     */
    public function getPersonalRepositories(): JsonResponse
    {
        try {
            $user = Auth::user();
            $token = $user->github_token;

            if (! $token) {
                return response()->json(['error' => 'GitHub token not found. Please authenticate with GitHub.'], 401);
            }

            $repositories = $this->githubAdapter->getPersonalRepositories($token);

            // If the adapter returned a JsonResponse (error case), return it directly
            if ($repositories instanceof JsonResponse) {
                return $repositories;
            }

            // Mark repositories that are already imported
            foreach ($repositories as &$repo) {
                $repo['is_imported'] = $this->isRepositoryImported($repo['html_url']);
            }

            return response()->json($repositories);
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while fetching repositories.'], 500);
        }
    }

    /**
     * Get the authenticated user's organization repositories from GitHub.
     */
    public function getOrganizationRepositories(): JsonResponse
    {
        try {
            $user = Auth::user();
            $token = $user->github_token;

            if (! $token) {
                return response()->json(['error' => 'GitHub token not found. Please authenticate with GitHub.'], 401);
            }

            $repositories = $this->githubAdapter->getOrganizationRepositories($token);

            if ($repositories instanceof JsonResponse) {
                return $repositories;
            }

            // Mark repositories that are already imported
            foreach ($repositories as &$repo) {
                $repo['is_imported'] = $this->isRepositoryImported($repo['html_url']);
            }

            return response()->json($repositories);
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while fetching organization repositories.'], 500);
        }
    }

    /**
     * Check if a repository is already imported as a project.
     *
     * @param string $repoUrl The GitHub repository URL
     * @return bool True if the repository is already imported, false otherwise
     */
    private function isRepositoryImported(string $repoUrl): bool
    {
        return Project::query()
            ->where('description', 'like', '%GitHub Repository: ' . $repoUrl . '%')
            ->exists();
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
    public function importRepository(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'full_name' => 'required|string',
                'html_url' => 'required|string|url',
            ]);

            $user = Auth::user();
            $token = $user->github_token;

            // Check if repository is already imported
            if ($this->isRepositoryImported($request->input('html_url'))) {
                return response()->json([
                    'success' => false,
                    'error' => 'Repository is already imported as a project.',
                ], 400);
            }

            $project = Project::query()->create([
                'user_id' => $user->getKey(),
                'name' => $request->input('name'),
                'description' => $request->input('description') . "\n\nGitHub Repository: " . $request->input('html_url'),
            ]);

            // Add repository collaborators to the project team
            if ($token) {
                // Parse owner and repo name from full_name (format: "owner/repo")
                $fullName = $request->input('full_name');
                $parts = explode('/', $fullName);

                if (count($parts) === 2) {
                    $owner = $parts[0];
                    $repo = $parts[1];

                    $collaborators = $this->githubAdapter->getRepositoryCollaborators($token, $owner, $repo);

                    if (!($collaborators instanceof JsonResponse)) {
                        foreach ($collaborators as $collaborator) {
                            // Try to find user by GitHub username or email
                            $teamMember = User::query()
                                ->where('email', $collaborator['email'] ?? '')
                                ->orWhere('name', $collaborator['login'] ?? '')
                                ->first();

                            if ($teamMember && $teamMember->id !== $user->id) {
                                // Add to team if not already a member
                                if (!$project->teamMembers()->where('member_id', $teamMember->id)->exists()) {
                                    $project->teamMembers()->attach($teamMember->id);
                                }
                            }
                        }
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Repository successfully imported as a project',
                'id' => $project->getKey(),
            ]);
        } catch (Exception $e) {
            Log::error('Error importing GitHub repository: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to import repository: ' . $e->getMessage(),
            ], 500);
        }
    }
}
