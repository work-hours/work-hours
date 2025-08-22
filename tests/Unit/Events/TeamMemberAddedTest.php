<?php

declare(strict_types=1);

use App\Events\TeamMemberAdded;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

it('broadcasts to the added member private channel and includes creator and member in payload', function (): void {
    $member = new User();
    $member->id = 123;
    $member->name = 'Bob';

    $creator = new User();
    $creator->id = 456;
    $creator->name = 'Alice';

    $event = new TeamMemberAdded($member, $creator);

    $channels = $event->broadcastOn();
    expect($channels)->toHaveCount(1)
        ->and($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and((string) $channels[0]->name)->toBe('private-App.Models.User.123');

    $payload = $event->broadcastWith();
    expect($payload)
        ->toHaveKeys(['member', 'creator'])
        ->and($payload['creator']->name)->toBe('Alice')
        ->and($payload['member']->id)->toBe(123);
});
