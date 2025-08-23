<?php

declare(strict_types=1);

use App\Models\Conversation;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can start a one-on-one chat with a team member and send a message', function (): void {
    $leader = User::factory()->create();
    $member = User::factory()->create();

    // team relation: leader -> member
    Team::query()->create([
        'user_id' => $leader->id,
        'member_id' => $member->id,
        'hourly_rate' => 0,
        'currency' => null,
        'non_monetary' => true,
    ]);

    $this->actingAs($leader);

    // start chat
    $response = $this->post(route('chat.start'), [
        'user_id' => $member->id,
    ]);

    $response->assertRedirect();

    $conversation = Conversation::query()
        ->whereHas('participants', fn ($q) => $q->where('users.id', $leader->id))
        ->whereHas('participants', fn ($q) => $q->where('users.id', $member->id))
        ->first();

    expect($conversation)->not->toBeNull();

    // send a message
    $response = $this->post(route('chat.send'), [
        'conversation_id' => $conversation->id,
        'body' => 'Hello there',
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('messages', [
        'conversation_id' => $conversation->id,
        'user_id' => $leader->id,
        'body' => 'Hello there',
    ]);
});
