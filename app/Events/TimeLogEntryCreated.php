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

final class TimeLogEntryCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        private readonly TimeLog $timeLog,
        private readonly User $creator,
        private readonly User $teamLeader,
    ) {}

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('App.Models.User.' . $this->teamLeader->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'timeLog' => $this->timeLog,
            'creator' => $this->creator,
            'teamLeader' => $this->teamLeader,
        ];
    }
}
