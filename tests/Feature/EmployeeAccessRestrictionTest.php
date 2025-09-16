<?php

declare(strict_types=1);

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

uses(RefreshDatabase::class);

it('allows employee to access sidebar urls', function (): void {
    $owner = User::factory()->create();
    $employee = User::factory()->create();

    Team::query()->create([
        'user_id' => $owner->getKey(),
        'member_id' => $employee->getKey(),
        'hourly_rate' => 0,
        'currency' => 'USD',
        'non_monetary' => false,
        'is_employee' => true,
    ]);

    actingAs($employee);

    get('/dashboard')->assertSuccessful();
    get('/project')->assertSuccessful();
    get('/task')->assertSuccessful();
    get('/time-log')->assertSuccessful();
});

it('blocks employee from non-sidebar urls', function (): void {
    $owner = User::factory()->create();
    $employee = User::factory()->create();

    Team::query()->create([
        'user_id' => $owner->getKey(),
        'member_id' => $employee->getKey(),
        'hourly_rate' => 0,
        'currency' => 'USD',
        'non_monetary' => false,
        'is_employee' => true,
    ]);

    actingAs($employee);

    get('/settings/profile')->assertForbidden();
    get('/invoice')->assertForbidden();
});

it('does not block non-employees', function (): void {
    $user = User::factory()->create();

    actingAs($user);

    // Should be accessible for non-employees as per normal app behavior
    get('/settings/profile')->assertSuccessful();
});
