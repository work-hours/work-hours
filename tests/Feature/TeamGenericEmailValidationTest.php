<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('disallows marking as employee when using a generic email domain', function (): void {
    $this->actingAs(User::factory()->create());

    $response = $this->from('/team')->post(route('team.store'), [
        'name' => 'Gmail User',
        'email' => 'someone@gmail.com',
        'password' => 'password',
        'hourly_rate' => 0,
        'currency' => 'USD',
        'is_employee' => true,
    ]);

    $response->assertSessionHasErrors(['is_employee']);
});

it('allows creation with generic email when not marked as employee', function (): void {
    $this->actingAs($owner = User::factory()->create());

    $response = $this->post(route('team.store'), [
        'name' => 'Gmail User',
        'email' => 'another@gmail.com',
        'password' => 'password',
        'hourly_rate' => 0,
        'currency' => 'USD',
        'is_employee' => false,
    ]);

    $response->assertOk();

    $this->assertDatabaseHas('teams', [
        'user_id' => $owner->id,
    ]);
});

it('allows marking as employee with non-generic domain', function (): void {
    $this->actingAs($owner = User::factory()->create());

    $response = $this->post(route('team.store'), [
        'name' => 'Corp User',
        'email' => 'john.doe@acme.corp',
        'password' => 'password',
        'hourly_rate' => 0,
        'currency' => 'USD',
        'is_employee' => true,
    ]);

    $response->assertOk();

    $this->assertDatabaseHas('teams', [
        'user_id' => $owner->id,
    ]);
});
