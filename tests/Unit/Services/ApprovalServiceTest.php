<?php

declare(strict_types=1);

use App\Enums\TimeLogStatus;
use App\Models\TimeLog;
use App\Models\User;
use App\Services\ApprovalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery as m;

uses(RefreshDatabase::class);

it('sets is_paid to true when a time log is approved', function (): void {
    // Create an approver user and act as them
    $approver = User::factory()->create();
    $this->actingAs($approver);

    // Create a pending time log (no related project needed since we mock authorization)
    $timeLog = TimeLog::query()->create([
        'user_id' => User::factory()->create()->id,
        'project_id' => \App\Models\Project::query()->create([
            'user_id' => $approver->id,
            'name' => 'Test Project',
        ])->id,
        'start_timestamp' => now()->subHour(),
        'end_timestamp' => now(),
        'duration' => 60,
        'is_paid' => false,
        'note' => 'Test entry',
        'status' => TimeLogStatus::PENDING,
    ]);

    // Use the real service; authorization will pass because the approver is the project owner (team leader)
    $service = new ApprovalService();

    // Approve the time log
    $service->processTimeLog($timeLog, TimeLogStatus::APPROVED, 'Looks good');

    // Assert it was marked as paid
    $timeLog->refresh();
    expect($timeLog->is_paid)->toBeTrue()
        ->and($timeLog->status)->toBe(TimeLogStatus::APPROVED);
});
