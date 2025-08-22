<?php

declare(strict_types=1);

use App\Events\TimeLogEntryCreated;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

it('broadcasts to the team leader private channel and includes timeLog, creator, and teamLeader in payload', function (): void {
    $teamLeader = new User();
    $teamLeader->id = 321;
    $teamLeader->name = 'Lead';

    $creator = new User();
    $creator->id = 111;
    $creator->name = 'Member';

    $timeLog = new TimeLog();
    $timeLog->id = 999;
    $timeLog->duration = 2.5;

    $event = new TimeLogEntryCreated($timeLog, $creator, $teamLeader);

    $channels = $event->broadcastOn();
    expect($channels)->toHaveCount(1)
        ->and($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and((string) $channels[0]->name)->toBe('private-App.Models.User.321');

    $payload = $event->broadcastWith();
    expect($payload)
        ->toHaveKeys(['timeLog', 'creator', 'teamLeader'])
        ->and($payload['creator']->name)->toBe('Member')
        ->and($payload['teamLeader']->id)->toBe(321)
        ->and($payload['timeLog']->id)->toBe(999);
});
