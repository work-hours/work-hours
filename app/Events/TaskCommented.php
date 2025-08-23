<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class TaskCommented implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        private readonly Task $task,
        private readonly TaskComment $comment,
        private readonly User $commenter,
        private readonly User $recipient,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->recipient->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task,
            'comment' => $this->comment,
            'commenter' => $this->commenter,
            'recipient' => $this->recipient,
        ];
    }
}
