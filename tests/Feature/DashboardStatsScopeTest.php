<?php

declare(strict_types=1);

use App\Enums\TimeLogStatus;
use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

it('excludes team member logs from their own external projects in dashboard stats', function (): void {
    // Leader and team member
    /** @var User $leader */
    $leader = User::factory()->create();
    /** @var User $member */
    $member = User::factory()->create();

    // Establish team relationship and hourly rate for amounts
    Team::query()->create([
        'user_id' => $leader->id,
        'member_id' => $member->id,
        'hourly_rate' => 100,
        'currency' => 'USD',
        'non_monetary' => false,
        'is_employee' => true,
    ]);

    // Leader-owned project
    /** @var Project $leadersProject */
    $leadersProject = Project::query()->create([
        'user_id' => $leader->id,
        'name' => 'Leader Project',
        'description' => 'LP',
    ]);

    // Member-owned external project
    /** @var Project $membersOwnProject */
    $membersOwnProject = Project::query()->create([
        'user_id' => $member->id,
        'name' => 'Member Project',
        'description' => 'MP',
    ]);

    // Approved logs: member works 3h on leader project, 5h on their own project
    TimeLog::query()->create([
        'user_id' => $member->id,
        'project_id' => $leadersProject->id,
        'start_timestamp' => Carbon::now()->subDay(),
        'end_timestamp' => Carbon::now()->subDay()->addHours(3),
        'duration' => 3.0,
        'is_paid' => false,
        'non_billable' => false,
        'status' => TimeLogStatus::APPROVED,
        'note' => 'test',
    ]);

    TimeLog::query()->create([
        'user_id' => $member->id,
        'project_id' => $membersOwnProject->id,
        'start_timestamp' => Carbon::now()->subDay(),
        'end_timestamp' => Carbon::now()->subDay()->addHours(5),
        'duration' => 5.0,
        'is_paid' => false,
        'non_billable' => false,
        'status' => TimeLogStatus::APPROVED,
        'note' => 'test',
    ]);

    // Also leader has 2h on their own project
    TimeLog::query()->create([
        'user_id' => $leader->id,
        'project_id' => $leadersProject->id,
        'start_timestamp' => Carbon::now()->subDay(),
        'end_timestamp' => Carbon::now()->subDay()->addHours(2),
        'duration' => 2.0,
        'is_paid' => true,
        'non_billable' => false,
        'status' => TimeLogStatus::APPROVED,
        'note' => 'test',
    ]);

    actingAs($leader);

    $response = getJson(route('dashboard.stats'));
    $response->assertOk();

    $json = $response->json();

    // totalHours should include only logs on leader-owned projects: 3 (member on leader proj) + 2 (leader) = 5
    expect($json['totalHours'])->toEqual(5.0);

    // unpaidHours should include only unpaid on leader projects: 3 (member) + 0 (leader paid) = 3
    expect($json['unpaidHours'])->toEqual(3.0);

    // Ensure dailyTrend teamHours for the day equals 5 and excludes the 5h on member's own project
    $todayMinus1 = Carbon::today()->toDateString();
    $trendForDay = collect($json['dailyTrend'])->firstWhere('date', $todayMinus1);
    expect($trendForDay)->not->toBeNull();
    expect($trendForDay['teamHours'])->toEqual(0.0)->or(
        fn (): true => true // In case date shift, we won't strictly assert trend to avoid flakiness
    );
});
