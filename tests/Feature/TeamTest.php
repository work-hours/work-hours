<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function (): void {
    $this->get('/team')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function (): void {
    $this->actingAs($user = User::factory()->create());

    $this->get('/team')->assertOk();
});

it('can creat a member', function (): void {
    $this->actingAs($user = User::factory()->create());

    $response = $this->post(route('team.store'), [
        'name' => 'New Member',
        'email' => fake()->unique()->safeEmail(),
        'password' => 'password',
        'hourly_rate' => 50,
        'currency' => 'USD',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('teams', [
        'user_id' => $user->id,
        'hourly_rate' => 50,
        'currency' => 'USD',
    ]);
});

it('can update a team member', function (): void {
    $this->actingAs($user = User::factory()->create());

    $teamMember = User::factory()->create();
    $this->post(route('team.store'), [
        'name' => $teamMember->name,
        'email' => $teamMember->email,
        'password' => 'password',
        'hourly_rate' => 50,
        'currency' => 'USD',
    ]);

    $response = $this->put(route('team.update', $teamMember), [
        'name' => 'Updated Member',
        'email' => $teamMember->email,
        'hourly_rate' => 75,
        'currency' => 'EUR',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('users', [
        'id' => $teamMember->id,
        'name' => 'Updated Member',
    ]);

    $this->assertDatabaseHas('teams', [
        'member_id' => $teamMember->id,
        'hourly_rate' => 75,
        'currency' => 'EUR',
    ]);
});

it('can delete a team member', function (): void {
    $this->actingAs($user = User::factory()->create());

    $teamMember = User::factory()->create();
    $this->post(route('team.store'), [
        'name' => $teamMember->name,
        'email' => $teamMember->email,
        'password' => 'password',
        'hourly_rate' => 50,
        'currency' => 'USD',
    ]);

    $response = $this->delete(route('team.destroy', $teamMember));

    $response->assertStatus(200);

    $this->assertDatabaseMissing('teams', [
        'member_id' => $teamMember->id,
        'user_id' => $user->id,
    ]);

    $this->assertDatabaseHas('users', [
        'id' => $teamMember->id,
        'name' => $teamMember->name,
    ]);
});

it('can export team members to CSV', function (): void {
    $this->actingAs($user = User::factory()->create());

    $teamMember1 = User::factory()->create(['name' => 'Alice', 'email' => 'alice@example.com']);
    $teamMember2 = User::factory()->create(['name' => 'Bob', 'email' => 'bob@example.com']);

    $this->post(route('team.store'), [
        'name' => $teamMember1->name,
        'email' => $teamMember1->email,
        'hourly_rate' => 50,
        'currency' => 'USD',
    ]);

    $this->post(route('team.store'), [
        'name' => $teamMember2->name,
        'email' => $teamMember2->email,
        'hourly_rate' => 75,
        'currency' => 'EUR',
    ]);

    $response = $this->get(route('team.export'));

    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
    $response->assertHeader('Content-Disposition', 'attachment; filename="team_members_' . now()->format('Y-m-d') . '.csv"');
});

it('can filter team members by start_date, end_date, and search', function (): void {
    $this->actingAs($user = User::factory()->create());

    // Create team members
    $teamMember1 = User::factory()->create(['name' => 'Alice', 'email' => 'alice@example.com']);
    $teamMember2 = User::factory()->create(['name' => 'Bob', 'email' => 'bob@example.com']);

    $this->post(route('team.store'), [
        'name' => $teamMember1->name,
        'email' => $teamMember1->email,
        'hourly_rate' => 50,
        'currency' => 'USD',
    ]);

    $this->post(route('team.store'), [
        'name' => $teamMember2->name,
        'email' => $teamMember2->email,
        'hourly_rate' => 75,
        'currency' => 'EUR',
    ]);

    // Test search filter
    $response = $this->get('/team?search=Alice');
    $response->assertStatus(200);
    $response->assertSee('Alice');
    $response->assertDontSee('Bob');
});
