<?php

declare(strict_types=1);

namespace App\Services;

use App\Adapters\GitHubAdapter;
use App\Adapters\JiraAdapter;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskCompleted;

final readonly class TaskService
{
    public function __construct(
        private GitHubAdapter $gitHubAdapter,
        private JiraAdapter $jiraAdapter,
    ) {}

    /**
     * Attach tags to a task.
     *
     * @param  array<int, string>  $tags
     */
    public function attachTags(array $tags, Task $task): void
    {
        $tagIds = [];

        foreach ($tags as $tagName) {
            $tag = Tag::query()->firstOrCreate([
                'name' => $tagName,
                'user_id' => auth()->id(),
            ]);

            $tagIds[] = $tag->id;
        }

        $task->tags()->sync($tagIds);
    }

    /**
     * Store uploaded attachments for the given task.
     */
    public function storeAttachments(StoreTaskRequest|UpdateTaskRequest $request, Task $task): void
    {
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file) {
                    $file->storeAs('tasks/' . $task->id, $file->getClientOriginalName(), 'public');
                }
            }
        }
    }

    /**
     * Notify the given user IDs that they have been assigned to the task.
     *
     * @param  array<int>  $userIds
     */
    public function notifyAssignees(Task $task, array $userIds): void
    {
        if ($userIds === []) {
            return;
        }

        if (! $task->relationLoaded('project')) {
            $task->load('project');
        }

        $users = User::query()->whereIn('id', $userIds)->get();
        foreach ($users as $user) {
            $user->notify(new TaskAssigned($task, auth()->user()));
            \App\Events\TaskAssigned::dispatch($task, auth()->user(), $user);
        }
    }

    /**
     * Notify project owner when task is completed by a non-owner.
     */
    public function notifyOnCompletion(Task $task, string $oldStatus, bool $isProjectOwner): void
    {
        if ($oldStatus === 'completed') {
            return;
        }

        $newStatus = $task->status;
        if ($newStatus === 'completed' && ! $isProjectOwner) {
            if (! $task->relationLoaded('project')) {
                $task->load('project');
            }

            $projectOwner = User::query()->find($task->project->user_id);
            $projectOwner?->notify(new TaskCompleted($task, auth()->user()));
            \App\Events\TaskCompleted::dispatch($task, auth()->user(), $projectOwner);
        }
    }

    /**
     * Update external integrations for imported tasks when flags are enabled.
     */
    public function updateExternalIntegrations(Task $task, bool $githubUpdate, bool $jiraUpdate): void
    {
        $isGithub = $task->is_imported && $task->meta && $task->meta->source === 'github';
        $isJira = $task->is_imported && $task->meta && $task->meta->source === 'jira';

        if ($isGithub && $githubUpdate) {
            $this->gitHubAdapter->updateGitHubIssue($task);
        }

        if ($isJira && $jiraUpdate) {
            $this->jiraAdapter->updateJiraIssue($task);
        }
    }

    /**
     * Delete external integrations for imported tasks when flags are enabled.
     */
    public function deleteExternalIntegrations(Task $task, bool $deleteGithub, bool $deleteJira): void
    {
        $isGithub = $task->is_imported && $task->meta && $task->meta->source === 'github';
        $isJira = $task->is_imported && $task->meta && $task->meta->source === 'jira';

        if ($deleteGithub && $isGithub) {
            $this->gitHubAdapter->deleteGitHubIssue($task);
        }

        if ($deleteJira && $isJira) {
            $this->jiraAdapter->deleteJiraIssue($task);
        }
    }
}
