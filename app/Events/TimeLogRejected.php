<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class TimeLogRejected implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        private readonly TimeLog $timeLog,
        private readonly User $approver,
        private readonly User $timeLogOwner,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->timeLogOwner->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'timeLog' => $this->timeLog,
            'approver' => $this->approver,
            'timeLogOwner' => $this->timeLogOwner,
        ];
    }
}
