<?php

declare(strict_types=1);

use App\Enums\TimeLogStatus;
use App\Http\Stores\TimeLogStore;
use App\Models\Project;
use App\Models\TimeLog;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('excludes non-billable time from unpaid hours in stats', function (): void {
    $log1 = new TimeLog([
        'duration' => 1.5,
        'is_paid' => false,
        'non_billable' => false,
        'status' => TimeLogStatus::APPROVED,
    ]);

    $log2 = new TimeLog([
        'duration' => 2.0,
        'is_paid' => false,
        'non_billable' => true,
        'status' => TimeLogStatus::APPROVED,
    ]);

    $log3 = new TimeLog([
        'duration' => 3.0,
        'is_paid' => true,
        'non_billable' => false,
        'status' => TimeLogStatus::APPROVED,
    ]);

    // Attach a dummy project relation to avoid amount computations failing
    $project = new Project(['user_id' => 999, 'name' => 'Demo']);
    $log1->user_id = 1;
    $log2->user_id = 1;
    $log3->user_id = 1;
    $log1->setRelation('project', $project);
    $log2->setRelation('project', $project);
    $log3->setRelation('project', $project);

    $collection = collect([$log1, $log2, $log3]);

    $stats = TimeLogStore::stats($collection);

    expect($stats['unpaid_hours'])->toBe(1.5);
    expect($stats['unbillable_hours'])->toBe(2.0);
});
