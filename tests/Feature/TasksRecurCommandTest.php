<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;

uses(RefreshDatabase::class);

it('creates next occurrence for daily recurring task due today', function (): void {
    $user = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $user->id,
        'name' => 'Proj',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    /** @var Task $task */
    $task = Task::query()->create([
        'project_id' => $project->id,
        'created_by' => $user->id,
        'title' => 'Daily Task',
        'description' => 'Body',
        'status' => 'pending',
        'priority' => 'medium',
        'due_date' => now()->toDateString(),
        'is_recurring' => true,
        'recurring_frequency' => 'daily',
    ]);

    // Associate user as assignee and create a tag
    $task->assignees()->sync([$user->id]);

    // Execute command
    $exitCode = Artisan::call('tasks:recur', ['frequency' => 'daily']);

    expect($exitCode)->toBe(0);

    $created = Task::query()
        ->where('project_id', $project->id)
        ->where('title', 'Daily Task')
        ->orderByDesc('id')
        ->first();

    expect($created)->not->toBeNull();
    expect($created->id)->not->toBe($task->id);
    expect($created->due_date?->toDateString())->toBe(now()->addDay()->toDateString());
    expect($created->is_recurring)->toBeTrue();
    expect($created->recurring_frequency)->toBe('daily');

    // Assignee copied
    $assignees = $created->assignees()->pluck('users.id')->all();
    expect($assignees)->toContain($user->id);
});

it('creates next occurrence for every_other_week frequency correctly', function (): void {
    $user = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $user->id,
        'name' => 'Proj',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    /** @var Task $task */
    $task = Task::query()->create([
        'project_id' => $project->id,
        'created_by' => $user->id,
        'title' => 'Biweekly Task',
        'description' => 'Body',
        'status' => 'pending',
        'priority' => 'medium',
        'due_date' => now()->toDateString(),
        'is_recurring' => true,
        'recurring_frequency' => 'every_other_week',
    ]);

    $exitCode = Artisan::call('tasks:recur', ['frequency' => 'every_other_week']);

    expect($exitCode)->toBe(0);

    $created = Task::query()
        ->where('project_id', $project->id)
        ->where('title', 'Biweekly Task')
        ->orderByDesc('id')
        ->first();

    expect($created)->not->toBeNull();
    expect($created->due_date?->toDateString())->toBe(now()->addWeeks(2)->toDateString());
});
