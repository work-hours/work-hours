<?php

declare(strict_types=1);

use App\Models\Permission;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

function attachTeam(User $leader, User $member): void
{
    Team::query()->create([
        'user_id' => $leader->id,
        'member_id' => $member->id,
        'hourly_rate' => 0,
        'currency' => 'USD',
        'non_monetary' => true,
        'is_employee' => true,
    ]);
}

it('allows leader to view a team member time logs', function (): void {
    $leader = User::factory()->create(['email_verified_at' => now()]);
    $member = User::factory()->create(['email_verified_at' => now()]);

    attachTeam($leader, $member);

    $this->actingAs($leader);

    $response = $this->get(route('team.time-logs', $member));
    $response->assertSuccessful();
});

it('forbids employee without permission from viewing member time logs', function (): void {
    $owner = User::factory()->create(['email_verified_at' => now()]);
    $employee = User::factory()->create(['email_verified_at' => now()]);
    $member = User::factory()->create(['email_verified_at' => now()]);

    // Make employee part of owner's team (as a member/employee)
    attachTeam($owner, $employee);
    // And member also under the same owner
    attachTeam($owner, $member);

    $this->actingAs($employee);

    $response = $this->get(route('team.time-logs', $member));
    $response->assertForbidden();
});

it('allows employee with "View Time Logs" permission to view member time logs under their leader', function (): void {
    $owner = User::factory()->create(['email_verified_at' => now()]);
    $employee = User::factory()->create(['email_verified_at' => now()]);
    $member = User::factory()->create(['email_verified_at' => now()]);

    // Set up team relationships
    attachTeam($owner, $employee);
    attachTeam($owner, $member);

    // Grant employee the required permission
    $permission = Permission::query()->firstOrCreate([
        'name' => 'View Time Logs',
    ], [
        'module' => 'Team',
        'description' => 'View all team time logs',
    ]);
    $employee->permissions()->syncWithoutDetaching([$permission->id]);

    $this->actingAs($employee);

    $response = $this->get(route('team.time-logs', $member));
    $response->assertSuccessful();
});
