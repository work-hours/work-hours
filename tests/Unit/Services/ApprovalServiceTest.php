<?php

declare(strict_types=1);

use App\Enums\TimeLogStatus;
use App\Models\Project;
use App\Models\ProjectTeam;
use App\Models\TimeLog;
use App\Models\User;
use App\Services\ApprovalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

it('sets is_paid to true when a time log is approved', function (): void {
    // Create an approver user and act as them
    $approver = User::factory()->create();
    $this->actingAs($approver);

    // Create a project and mark the acting user as an approver on it
    $project = Project::query()->create([
        'user_id' => User::factory()->create()->id, // project owner is someone else
        'name' => 'Test Project',
    ]);

    ProjectTeam::query()->create([
        'project_id' => $project->id,
        'member_id' => $approver->id,
        'is_approver' => true,
    ]);

    // Create a pending time log for another user on the same project
    $timeLog = TimeLog::query()->create([
        'user_id' => User::factory()->create()->id,
        'project_id' => $project->id,
        'start_timestamp' => now()->subHour(),
        'end_timestamp' => now(),
        'duration' => 60,
        'is_paid' => false,
        'note' => 'Test entry',
        'status' => TimeLogStatus::PENDING,
    ]);

    $service = new ApprovalService();

    // Prevent broadcasting/network calls during test
    Event::fake();
    Notification::fake();

    // Approve the time log
    $service->processTimeLog($timeLog, TimeLogStatus::APPROVED, 'Looks good');

    // Assert it was marked as paid
    $timeLog->refresh();
    expect($timeLog->is_paid)->toBeTrue()
        ->and($timeLog->status)->toBe(TimeLogStatus::APPROVED);
});

it('project owner can see pending approvals even if not an approver', function (): void {
    $owner = User::factory()->create();
    $this->actingAs($owner);

    $project = Project::query()->create([
        'user_id' => $owner->id, // owner is not approver by default
        'name' => 'Owner Project',
    ]);

    // Another member added to project team
    ProjectTeam::query()->create([
        'project_id' => $project->id,
        'member_id' => $memberId = User::factory()->create()->id,
        'is_approver' => false,
    ]);

    // Create a pending time log for that member
    TimeLog::query()->create([
        'user_id' => $memberId,
        'project_id' => $project->id,
        'start_timestamp' => now()->subHour(),
        'end_timestamp' => now(),
        'duration' => 60,
        'is_paid' => false,
        'note' => 'Pending log',
        'status' => TimeLogStatus::PENDING,
    ]);

    $service = new ApprovalService();

    $pending = $service->getPendingApprovals();

    expect($pending->count())->toBe(1);
});

it('project owner cannot approve unless explicitly an approver', function (): void {
    $owner = User::factory()->create();
    $this->actingAs($owner);

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Owner Project',
    ]);

    // Add a non-owner member and a pending log
    $member = User::factory()->create();
    ProjectTeam::query()->create([
        'project_id' => $project->id,
        'member_id' => $member->id,
        'is_approver' => false,
    ]);

    $timeLog = TimeLog::query()->create([
        'user_id' => $member->id,
        'project_id' => $project->id,
        'start_timestamp' => now()->subHour(),
        'end_timestamp' => now(),
        'duration' => 60,
        'is_paid' => false,
        'note' => 'Pending log',
        'status' => TimeLogStatus::PENDING,
    ]);

    $service = new ApprovalService();

    // Expect authorization exception when owner (not approver) tries to approve
    expect(fn () => $service->processTimeLog($timeLog, TimeLogStatus::APPROVED, ''))->toThrow(Exception::class);
});
