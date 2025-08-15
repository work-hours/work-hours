<?php

declare(strict_types=1);

namespace App\Events;

use App\Models\Task;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

final class TaskUpdated implements ShouldDispatchAfterCommit
{
    use Dispatchable;
    use InteractsWithSockets;
    use SerializesModels;

    public function __construct(
        public Task $task,
        /** @var array<int> */
        public array $addedAssigneeIds = [],
        public string $oldStatus = '',
        public bool $isProjectOwner = false,
        public bool $githubUpdate = false,
        public bool $jiraUpdate = false,
        public ?string $newStatus = null,
    ) {}
}
