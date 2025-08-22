<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use App\Notifications\TaskCommented;
use Msamgan\Lact\Attributes\Action;

final class TaskCommentController extends Controller
{
    #[Action(method: 'post', name: 'task.comments.store', params: ['task'], middleware: ['auth', 'verified'])]
    public function store(Task $task): void
    {
        $task->load(['project', 'assignees']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isTeamMember = $task->project->teamMembers->contains('id', auth()->id());
        $isAssignee = $task->assignees->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isTeamMember && ! $isAssignee, 403, 'Unauthorized action.');

        request()->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $comment = TaskComment::query()->create([
            'task_id' => $task->id,
            'user_id' => auth()->id(),
            'body' => request('body'),
        ]);

        $recipientIds = collect([$task->project->user_id])
            ->merge($task->assignees->pluck('id'))
            ->unique()
            ->reject(fn ($id): bool => $id === (int) auth()->id())
            ->values();

        $rawBody = (string) request('body');
        $textBody = mb_trim(strip_tags($rawBody));

        if ($textBody !== '' && preg_match_all('/@([A-Za-z0-9._-]+)/', $textBody, $matches)) {
            $handles = collect($matches[1] ?? [])->filter()->map(fn ($h): string => mb_strtolower($h))->unique()->values();

            if ($handles->isNotEmpty()) {
                $allowedUsers = collect([$task->project->user])
                    ->merge($task->project->teamMembers)
                    ->merge($task->assignees)
                    ->filter()
                    ->unique('id')
                    ->values();

                $normalize = static function (string $name): string {
                    $base = mb_strtolower($name);

                    return preg_replace('/[^a-z0-9._-]+/i', '', $base) ?? $base;
                };

                $handleToUserIds = collect();
                foreach ($allowedUsers as $u) {
                    $handle = $normalize($u->name);
                    if ($handle !== '') {
                        $handleToUserIds->put($handle, $u->id);
                    }

                    if (! empty($u->email) && str_contains($u->email, '@')) {
                        $local = mb_strtolower(strtok($u->email, '@'));
                        if ($local !== '0') {
                            $handleToUserIds->put($local, $u->id);
                        }
                    }
                }

                $mentionedIds = $handles
                    ->map(fn ($h) => $handleToUserIds->get($h))
                    ->filter()
                    ->unique()
                    ->values();

                if ($mentionedIds->isNotEmpty()) {
                    $recipientIds = $recipientIds->merge($mentionedIds)->unique()->values();
                }
            }
        }

        $recipientIdArray = $recipientIds
            ->reject(fn ($id): bool => $id === (int) auth()->id())
            ->values()
            ->all();

        if ($recipientIdArray !== []) {
            $users = User::query()->whereIn('id', $recipientIdArray)->get();
            foreach ($users as $user) {
                $user->notify(new TaskCommented($task, $comment, auth()->user()));
                \App\Events\TaskCommented::dispatch($task, $comment, auth()->user(), $user);
            }
        }

        back()->throwResponse();
    }

    #[Action(method: 'delete', name: 'task.comments.destroy', params: ['task', 'comment'], middleware: ['auth', 'verified'])]
    public function destroy(Task $task, TaskComment $comment): void
    {
        abort_if($comment->task_id !== $task->id, 404, 'Comment not found for this task.');

        $task->load(['project']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isCommentOwner = $comment->user_id === auth()->id();

        abort_if(! $isProjectOwner && ! $isCommentOwner, 403, 'Unauthorized action.');

        $comment->delete();

        back()->throwResponse();
    }

    #[Action(method: 'put', name: 'task.comments.update', params: ['task', 'comment'], middleware: ['auth', 'verified'])]
    public function update(Task $task, TaskComment $comment): void
    {
        abort_if($comment->task_id !== $task->id, 404, 'Comment not found for this task.');

        $task->load(['project']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isCommentOwner = $comment->user_id === auth()->id();

        abort_if(! $isProjectOwner && ! $isCommentOwner, 403, 'Unauthorized action.');

        request()->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $comment->update([
            'body' => request('body'),
        ]);

        back()->throwResponse();
    }
}
