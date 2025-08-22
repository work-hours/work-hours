<?php

declare(strict_types=1);

use App\Events\TimeLogRejected;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

it('broadcasts to the time log owner private channel and includes timeLog, approver, and timeLogOwner in payload', function (): void {
    $owner = new User();
    $owner->id = 888;
    $owner->name = 'Owner';

    $approver = new User();
    $approver->id = 55;
    $approver->name = 'Leader';

    $timeLog = new TimeLog();
    $timeLog->id = 2002;
    $timeLog->duration = 1.75;

    $event = new TimeLogRejected($timeLog, $approver, $owner);

    $channels = $event->broadcastOn();
    expect($channels)->toHaveCount(1)
        ->and($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and((string) $channels[0]->name)->toBe('private-App.Models.User.888');

    $payload = $event->broadcastWith();
    expect($payload)
        ->toHaveKeys(['timeLog', 'approver', 'timeLogOwner'])
        ->and($payload['approver']->name)->toBe('Leader')
        ->and($payload['timeLogOwner']->id)->toBe(888)
        ->and($payload['timeLog']->id)->toBe(2002);
});
