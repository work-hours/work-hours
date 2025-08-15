<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Adapters\GitHubAdapter;
use App\Adapters\JiraAdapter;
use App\Events\TaskUpdated;
use App\Models\User;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskCompleted;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Auth;

final class TaskUpdatedListener implements ShouldQueue
{
    public function __construct(
        public GitHubAdapter $gitHubAdapter,
        public JiraAdapter $jiraAdapter,
    ) {}

    public function handle(TaskUpdated $event): void
    {
        $task = $event->task;

        if ($event->addedAssigneeIds !== []) {
            if (! $task->relationLoaded('project')) {
                $task->load('project');
            }

            $users = User::query()->whereIn('id', $event->addedAssigneeIds)->get();
            foreach ($users as $user) {
                $user->notify(new TaskAssigned($task, Auth::user()));
            }
        }

        if ($event->oldStatus !== 'completed' && $event->newStatus === 'completed' && ! $event->isProjectOwner) {
            if (! $task->relationLoaded('project')) {
                $task->load('project');
            }

            $projectOwner = User::query()->find($task->project->user_id);
            $projectOwner?->notify(new TaskCompleted($task, Auth::user()));
        }

        $isGithub = $task->is_imported && $task->meta && $task->meta->source === 'github';
        $isJira = $task->is_imported && $task->meta && $task->meta->source === 'jira';

        if ($isGithub && $event->githubUpdate) {
            $this->gitHubAdapter->updateGitHubIssue($task);
        }

        if ($isJira && $event->jiraUpdate) {
            $this->jiraAdapter->updateJiraIssue($task);
        }
    }
}
