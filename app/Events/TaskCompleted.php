<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Task;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class TaskCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        private readonly Task $task,
        private readonly User $completer,
        private readonly User $projectOwner
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->projectOwner->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'task' => $this->task,
            'completer' => $this->completer,
            'projectOwner' => $this->projectOwner,
        ];
    }
}
