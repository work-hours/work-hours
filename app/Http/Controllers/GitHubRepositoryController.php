<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\GitHubAdapter;
use App\Http\Requests\GitRepoToProjectRequest;
use App\Models\Project;
use Exception;
use Illuminate\Http\JsonResponse;
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

            return response()->json([
                'success' => true,
                'message' => 'Repository successfully imported as a project',
                'id' => $project->getKey(),
            ]);
        } catch (Exception $e) {
            Log::error('Error importing GitHub repository: ' . $e->getMessage());

            return $this->errorResponse('Failed to import repository: ' . $e->getMessage(), 500);
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
            'repo_id' => $data['id'],
            'source' => 'github', // Set the source as github for imported repositories
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
}
