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
    public function __construct(private readonly GitHubAdapter $githubAdapter) {}

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

            if ($repositories instanceof JsonResponse) {
                return $repositories;
            }

            foreach ($repositories as &$repo) {
                $repo['is_imported'] = $this->isRepositoryImported($repo['full_name']);
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

            foreach ($repositories as &$repo) {
                $repo['is_imported'] = $this->isRepositoryImported($repo['full_name']);
            }

            return response()->json($repositories);
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while fetching organization repositories.'], 500);
        }
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

            if ($this->isRepositoryImported($request->input('full_name'))) {
                return response()->json([
                    'success' => false,
                    'error' => 'Repository is already imported as a project.',
                ], 400);
            }

            $project = Project::query()->create([
                'user_id' => $user->getKey(),
                'name' => $request->input('full_name'),
                'description' => $request->input('description') . "\n\nGitHub Repository: " . $request->input('html_url'),
            ]);

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
}
