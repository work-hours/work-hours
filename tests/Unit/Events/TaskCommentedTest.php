<?php

declare(strict_types=1);

use App\Events\TaskCommented;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Broadcasting\PrivateChannel;

it('broadcasts to the recipient private channel and includes task, comment, commenter, and recipient in payload', function (): void {
    $recipient = new User();
    $recipient->id = 555;
    $recipient->name = 'Recipient';

    $commenter = new User();
    $commenter->id = 777;
    $commenter->name = 'Commenter';

    $task = new Task();
    $task->id = 1234;
    $task->title = 'Example Task';

    $comment = new TaskComment();
    $comment->id = 9876;
    $comment->body = 'Looks good!';

    $event = new TaskCommented($task, $comment, $commenter, $recipient);

    $channels = $event->broadcastOn();
    expect($channels)->toHaveCount(1)
        ->and($channels[0])->toBeInstanceOf(PrivateChannel::class)
        ->and((string) $channels[0]->name)->toBe('private-App.Models.User.555');

    $payload = $event->broadcastWith();
    expect($payload)
        ->toHaveKeys(['task', 'comment', 'commenter', 'recipient'])
        ->and($payload['recipient']->id)->toBe(555)
        ->and($payload['commenter']->name)->toBe('Commenter')
        ->and($payload['task']->id)->toBe(1234)
        ->and($payload['comment']->id)->toBe(9876);
});
