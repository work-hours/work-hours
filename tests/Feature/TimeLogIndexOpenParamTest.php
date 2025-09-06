<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('passes open prop when query param open=true on time-log index', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('time-log.index', ['open' => 'true']))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('time-log/index')
            ->where('open', true)
        );
});
