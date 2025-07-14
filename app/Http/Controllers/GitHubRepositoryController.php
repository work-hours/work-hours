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
     * Display the GitHub repositories page.
     */
    public function index(): Response
    {
        return Inertia::render('github/repositories');
    }
}
