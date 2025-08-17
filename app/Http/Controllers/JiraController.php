<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\JiraAdapter;
use App\Http\Requests\JiraCredentialsRequest;
use App\Http\Requests\JiraProjectImportRequest;
use App\Models\Project;
use App\Services\JiraService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;

final class JiraController extends Controller
{
    public function __construct(
        private readonly JiraAdapter $jiraAdapter,
        private readonly JiraService $jiraService,
    ) {}

    /**
     * Display the Jira connection page.
     */
    public function connect(): Response
    {
        return Inertia::render('jira/connect');
    }

    /**
     * Display the Jira projects page.
     */
    public function index(): Response
    {
        return Inertia::render('jira/projects');
    }

    /**
     * Test and save Jira credentials.
     */
    public function storeCredentials(JiraCredentialsRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();

            $domain = $validatedData['domain'];
            $email = $validatedData['email'];
            $token = $validatedData['token'];

            if (! $this->jiraAdapter->testCredentials($domain, $email, $token)) {
                return $this->jiraService->errorResponse('Invalid Jira credentials. Please check your domain, email, and API token.', 400);
            }

            $this->jiraAdapter->saveJiraCredentials($domain, $email, $token);

            return response()->json([
                'success' => true,
                'message' => 'Jira credentials validated and saved successfully.',
            ]);
        } catch (Exception $e) {
            Log::error('Error saving Jira credentials: ' . $e->getMessage());

            return $this->jiraService->errorResponse('Failed to save Jira credentials: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get Jira projects using the stored credentials.
     */
    public function getProjects(): JsonResponse
    {
        try {
            $credentials = $this->jiraService->getCredentialsOrError('Jira credentials not found. Please set up your Jira credentials first.');
            if ($credentials instanceof JsonResponse) {
                return $credentials;
            }

            $projects = $this->jiraAdapter->getProjects(
                $credentials['domain'],
                $credentials['email'],
                $credentials['token']
            );

            $importedProjectKeys = Project::query()
                ->where('source', 'jira')
                ->pluck('repo_id')
                ->toArray();

            return response()->json([
                'success' => true,
                'projects' => $projects,
                'importedProjectKeys' => $importedProjectKeys,
            ]);
        } catch (Exception $e) {
            Log::error('Error fetching Jira projects: ' . $e->getMessage());

            return $this->jiraService->errorResponse('Failed to fetch Jira projects: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Import a Jira project.
     */
    public function importProject(JiraProjectImportRequest $request): JsonResponse
    {
        try {
            $validatedData = $request->validated();
            $credentials = $this->jiraService->getCredentialsOrError('Jira credentials not found. Please set up your Jira credentials first.');
            if ($credentials instanceof JsonResponse) {
                return $credentials;
            }

            if (Project::query()->where('source', 'jira')
                ->where('repo_id', $validatedData['key'])
                ->exists()) {
                return $this->jiraService->errorResponse('This Jira project has already been imported.', 400);
            }

            $project = new Project();
            $project->name = $validatedData['name'];
            $project->description = $validatedData['description'] ?? null;
            $project->source = 'jira';
            $project->repo_id = $validatedData['key'];
            $project->user_id = Auth::id();
            $project->save();

            $this->jiraService->importIssuesAsTasks($credentials, $validatedData['key'], $project);

            return response()->json([
                'success' => true,
                'message' => 'Jira project and its issues successfully imported',
                'id' => $project->getKey(),
            ]);
        } catch (Exception $e) {
            Log::error('Error importing Jira project: ' . $e->getMessage());

            return $this->jiraService->errorResponse('Failed to import Jira project: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Sync a Jira project and its issues.
     *
     * @param  Project  $project  The project to sync
     * @return JsonResponse The response
     */
    #[Action(method: 'post', name: 'jira.projects.sync', params: ['project'])]
    public function syncProject(Project $project): JsonResponse
    {
        try {
            if ($project->source !== 'jira' || ! $project->repo_id) {
                return $this->jiraService->errorResponse('This project is not a Jira project.', 400);
            }

            $credentials = $this->jiraService->getCredentialsOrError('Jira credentials not found for this project.');
            if ($credentials instanceof JsonResponse) {
                return $credentials;
            }

            $result = $this->jiraService->importIssuesAsTasks($credentials, $project->repo_id, $project);

            return response()->json([
                'success' => true,
                'message' => 'Jira project and issues successfully synced',
                'new_tasks' => $result['new_tasks'],
                'updated_tasks' => $result['updated_tasks'],
            ]);
        } catch (Exception $e) {
            Log::error('Error syncing Jira project: ' . $e->getMessage());

            return $this->jiraService->errorResponse('Failed to sync Jira project: ' . $e->getMessage(), 500);
        }
    }
}
