<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

it('accepts every_other_week as recurring frequency and persists it', function (): void {
    $user = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $user->id,
        'name' => 'Recurring Project',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    actingAs($user);

    $payload = [
        'project_id' => $project->id,
        'title' => 'Recurring Task',
        'description' => 'Body',
        'status' => 'pending',
        'priority' => 'medium',
        'due_date' => now()->toDateString(),
        'is_recurring' => true,
        'recurring_frequency' => 'every_other_week',
    ];

    $resp = postJson(route('task.store'), $payload);

    $resp->assertSuccessful();

    /** @var Task $task */
    $task = Task::query()->latest()->first();

    expect($task)->not->toBeNull();
    expect($task->is_recurring)->toBeTrue();
    expect($task->recurring_frequency)->toBe('every_other_week');
});
