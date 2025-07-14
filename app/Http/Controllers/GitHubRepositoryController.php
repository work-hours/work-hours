<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\GitHubAdapter;
use App\Models\GitHubRepository;
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
            $token = session('github_token');

            if (! $token) {
                return response()->json(['error' => 'GitHub token not found. Please authenticate with GitHub.'], 401);
            }

            $repositories = $this->githubAdapter->getPersonalRepositories($token);

            // If the adapter returned a JsonResponse (error case), return it directly
            if ($repositories instanceof JsonResponse) {
                return $repositories;
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
            $token = session('github_token');

            if (! $token) {
                return response()->json(['error' => 'GitHub token not found. Please authenticate with GitHub.'], 401);
            }

            $repositories = $this->githubAdapter->getOrganizationRepositories($token);

            // If the adapter returned a JsonResponse (error case), return it directly
            if ($repositories instanceof JsonResponse) {
                return $repositories;
            }

            return response()->json($repositories);
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while fetching organization repositories.'], 500);
        }
    }

    /**
     * Save selected repositories to a project.
     */
    public function saveRepositories(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'project_id' => 'required|exists:projects,id',
                'repositories' => 'required|array',
                'repositories.*.id' => 'required|string',
                'repositories.*.name' => 'required|string',
                'repositories.*.full_name' => 'required|string',
                'repositories.*.html_url' => 'required|string',
                'repositories.*.private' => 'required|boolean',
                'repositories.*.organization' => 'nullable|string',
            ]);

            $project = Project::findOrFail($validated['project_id']);

            // Check if the user is authorized to update this project
            if (! $project->isCreator(Auth::id())) {
                return response()->json(['error' => 'You are not authorized to update this project.'], 403);
            }

            $savedRepos = $this->githubAdapter->saveRepositories(
                $project,
                $validated['repositories'],
                Auth::id()
            );

            return response()->json([
                'message' => 'Repositories saved successfully.',
                'repositories' => $savedRepos,
            ]);
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while saving repositories.'], 500);
        }
    }

    /**
     * Get repositories for a project.
     */
    public function getProjectRepositories(Project $project): JsonResponse
    {
        try {
            // Check if the user is authorized to view this project
            if (! $project->isCreator(Auth::id()) && ! $project->teamMembers->contains(Auth::id())) {
                return response()->json(['error' => 'You are not authorized to view this project.'], 403);
            }

            $repositories = $this->githubAdapter->getProjectRepositories($project);

            return response()->json($repositories);
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while fetching project repositories.'], 500);
        }
    }

    /**
     * Remove a repository from a project.
     */
    public function removeRepository(GitHubRepository $repository): JsonResponse
    {
        try {
            // Check if the user is authorized to update this repository
            if ($repository->user_id !== Auth::id()) {
                return response()->json(['error' => 'You are not authorized to remove this repository.'], 403);
            }

            $this->githubAdapter->removeRepository($repository);

            return response()->json(['message' => 'Repository removed successfully.']);
        } catch (Exception $e) {
            Log::error($e);

            return response()->json(['error' => 'An error occurred while removing the repository.'], 500);
        }
    }

    /**
     * Display the GitHub repositories page.
     */
    public function index(): Response
    {
        $projects = Auth::user()->projects()->get();

        return Inertia::render('github/repositories', [
            'projects' => $projects,
        ]);
    }
}
