<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\GitRepoToProjectRequest;
use App\Models\Project;
use App\Services\GitHubRepositoryService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;

final class GitHubRepositoryController extends Controller
{
    public function __construct(private readonly GitHubRepositoryService $service) {}

    /**
     * Get the authenticated user's personal repositories from GitHub.
     */
    public function getPersonalRepositories(): JsonResponse
    {
        return $this->service->fetchRepositories('personal');
    }

    /**
     * Get the authenticated user's organization repositories from GitHub.
     */
    public function getOrganizationRepositories(): JsonResponse
    {
        return $this->service->fetchRepositories('organization');
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

            if ($this->service->isRepositoryImported($validatedData['full_name'])) {
                return $this->service->errorResponse('Repository is already imported as a project.', 400);
            }

            $project = $this->service->createProjectFromRepository($validatedData);

            $token = $this->service->getGitHubToken();
            if (! ($token instanceof JsonResponse)) {

                [$repoOwner, $repoName] = explode('/', (string) $validatedData['full_name']);

                $this->service->importIssuesAsTasks($token, $repoOwner, $repoName, $project);
            }

            return response()->json([
                'success' => true,
                'message' => 'Repository and its issues successfully imported as a project with tasks',
                'id' => $project->getKey(),
            ]);
        } catch (Exception $e) {
            Log::error('Error importing GitHub repository: ' . $e->getMessage());

            return $this->service->errorResponse('Failed to import repository: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Sync a GitHub repository project and its issues.
     *
     * @param  Project  $project  The project to sync
     * @return JsonResponse The response
     */
    #[Action(method: 'post', name: 'github.repositories.sync', params: ['project'])]
    public function syncRepository(Project $project): JsonResponse
    {
        try {

            if ($project->source !== 'github') {
                return $this->service->errorResponse('This project is not a GitHub repository.', 400);
            }

            $token = $this->service->getGitHubToken();
            if ($token instanceof JsonResponse) {
                return $token;
            }

            [$repoOwner, $repoName] = explode('/', $project->name);

            $issues = $this->service->getRepositoryIssues($token, $repoOwner, $repoName);

            if ($issues instanceof JsonResponse || ! is_array($issues)) {
                return $this->service->errorResponse("Failed to fetch issues from GitHub repository: {$repoOwner}/{$repoName}", 500);
            }

            $newCount = 0;
            $updatedCount = 0;

            foreach ($issues as $issue) {
                try {

                    if (isset($issue['pull_request'])) {
                        continue;
                    }

                    $existingTask = $project->tasks()
                        ->whereHas('meta', function ($query) use ($issue): void {
                            $query->where('source', 'github')
                                ->where('source_id', (string) $issue['id']);
                        })
                        ->first();

                    if ($existingTask) {

                        [$status, $priority] = $this->service->computeStatusAndPriority($issue);

                        $updateData = [
                            'title' => $issue['title'],
                            'description' => $issue['body'] ?? '',
                            'status' => $status,
                            'priority' => $priority,
                        ];

                        if ($existingTask->created_by === null) {
                            $updateData['created_by'] = $project->user_id;
                        }

                        $existingTask->update($updateData);

                        $existingTask->meta->update([
                            'source_state' => $issue['state'],
                            'source_url' => $issue['html_url'],
                            'extra_data' => $this->service->buildIssueExtraData($issue),
                        ]);

                        $this->service->syncTagsFromGitHubLabels($issue['labels'] ?? [], $project->user_id, $status, $priority, $existingTask, true);

                        $updatedCount++;
                    } else {

                        [$status, $priority] = $this->service->computeStatusAndPriority($issue);

                        $task = $project->tasks()->create([
                            'title' => $issue['title'],
                            'description' => $issue['body'] ?? '',
                            'status' => $status,
                            'priority' => $priority,
                            'is_imported' => true,
                            'created_by' => $project->user_id,
                        ]);

                        $task->meta()->create([
                            'source' => 'github',
                            'source_id' => (string) $issue['id'],
                            'source_number' => (string) $issue['number'],
                            'source_url' => $issue['html_url'],
                            'source_state' => $issue['state'],
                            'extra_data' => $this->service->buildIssueExtraData($issue),
                        ]);

                        $this->service->syncTagsFromGitHubLabels($issue['labels'] ?? [], $project->user_id, $status, $priority, $task, false);

                        $newCount++;
                    }
                } catch (Exception $e) {
                    Log::error("Failed to sync GitHub issue #{$issue['number']}: " . $e->getMessage());

                    continue; // Continue with the next issue even if one fails
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Successfully synced project from GitHub. {$newCount} new issues imported, {$updatedCount} issues updated.",
                'project_id' => $project->id,
            ]);
        } catch (Exception $e) {
            Log::error('Error syncing GitHub repository: ' . $e->getMessage(), [
                'project_id' => $project->id,
                'project_name' => $project->name,
            ]);

            return $this->service->errorResponse('Failed to sync repository: ' . $e->getMessage(), 500);
        }
    }
}
