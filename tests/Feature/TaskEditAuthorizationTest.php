<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

uses(RefreshDatabase::class);

it('allows project owner or task creator to access edit page', function (): void {
    $owner = User::factory()->create();
    $creator = User::factory()->create();
    $other = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Proj',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    // Creator (not owner) creates a task under owner's project
    actingAs($creator);
    /** @var Task $task */
    $task = Task::query()->create([
        'project_id' => $project->id,
        'created_by' => $creator->id,
        'title' => 'T',
        'description' => 'D',
        'status' => 'pending',
        'priority' => 'medium',
    ]);

    // Creator can access edit
    $respCreator = get(route('task.edit', $task->id));
    $respCreator->assertSuccessful();

    // Owner can access edit
    actingAs($owner);
    $respOwner = get(route('task.edit', $task->id));
    $respOwner->assertSuccessful();

    // Other cannot access edit
    actingAs($other);
    $respOther = get(route('task.edit', $task->id));
    $respOther->assertForbidden();
});

it('allows project owner or task creator to update a task and denies others', function (): void {
    $owner = User::factory()->create();
    $creator = User::factory()->create();
    $other = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Proj2',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    // Creator (not owner) creates a task under owner's project
    $task = Task::query()->create([
        'project_id' => $project->id,
        'created_by' => $creator->id,
        'title' => 'Old',
        'description' => null,
        'status' => 'pending',
        'priority' => 'medium',
    ]);

    // Creator can update
    actingAs($creator);
    $respCreator = post(route('task.update', $task->id), [
        'project_id' => $project->id,
        'title' => 'New Title',
        'description' => 'Updated',
        'status' => 'in_progress',
        'priority' => 'high',
        'due_date' => now()->toDateString(),
        'assignees' => [],
    ]);
    $respCreator->assertSuccessful();
    $task->refresh();
    expect($task->title)->toBe('New Title');

    // Other cannot update
    actingAs($other);
    $respOther = post(route('task.update', $task->id), [
        'project_id' => $project->id,
        'title' => 'Hacker',
        'description' => null,
        'status' => 'pending',
        'priority' => 'low',
    ]);
    $respOther->assertForbidden();

    // Owner can update
    actingAs($owner);
    $respOwner = post(route('task.update', $task->id), [
        'project_id' => $project->id,
        'title' => 'Owner Update',
        'description' => null,
        'status' => 'completed',
        'priority' => 'low',
    ]);
    $respOwner->assertSuccessful();
});
