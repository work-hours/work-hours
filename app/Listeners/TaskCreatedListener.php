<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Adapters\GitHubAdapter;
use App\Adapters\JiraAdapter;
use App\Events\TaskCreated;
use App\Models\User;
use App\Notifications\TaskAssigned;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Auth;

final class TaskCreatedListener implements ShouldQueue
{
    public function __construct(
        public GitHubAdapter $gitHubAdapter,
        public JiraAdapter $jiraAdapter,
    ) {}

    public function handle(TaskCreated $event): void
    {
        $task = $event->task;

        if ($event->assigneeIds !== []) {
            if (! $task->relationLoaded('project')) {
                $task->load('project');
            }

            $users = User::query()->whereIn('id', $event->assigneeIds)->get();
            foreach ($users as $user) {
                $user->notify(new TaskAssigned($task, Auth::user()));
            }
        }

        if ($event->createGithubIssue) {
            $this->gitHubAdapter->createGitHubIssue($task);
        }

        if ($event->createJiraIssue) {
            $this->jiraAdapter->createJiraIssue($task);
        }
    }
}
