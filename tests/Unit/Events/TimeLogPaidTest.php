<?php

declare(strict_types=1);

use App\Events\TimeLogPaid;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

it('broadcasts to the recipient private channel and includes timeLog, payer, and recipient in payload', function (): void {
    $recipient = new User();
    $recipient->id = 999;
    $recipient->name = 'Recipient';

    $payer = new User();
    $payer->id = 77;
    $payer->name = 'Payer';

    $timeLog = new TimeLog();
    $timeLog->id = 3003;
    $timeLog->duration = 2.5;

    $event = new TimeLogPaid($timeLog, $payer, $recipient);

    $channels = $event->broadcastOn();
    expect($channels)->toHaveCount(1)
        ->and($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and((string) $channels[0]->name)->toBe('private-App.Models.User.999');

    $payload = $event->broadcastWith();
    expect($payload)
        ->toHaveKeys(['timeLog', 'payer', 'recipient'])
        ->and($payload['payer']->name)->toBe('Payer')
        ->and($payload['recipient']->id)->toBe(999)
        ->and($payload['timeLog']->id)->toBe(3003);
});
