<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('authorizes presence online channel for authenticated users', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/broadcasting/auth', [
        // Presence channels are prefixed with 'presence-'
        'channel_name' => 'presence-online',
        'socket_id' => '1234.5678',
    ]);

    $response->assertOk();
});
