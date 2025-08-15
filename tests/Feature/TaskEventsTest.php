<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

it('stores a task successfully without events/listeners', function (): void {
    $owner = User::factory()->create();
    actingAs($owner);

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Project A',
        'description' => 'Test',
        'paid_amount' => 0,
        'source' => 'local',
    ]);

    post(route('task.store'), [
        'project_id' => $project->id,
        'title' => 'New Task',
        'description' => 'Body',
        'status' => 'pending',
        'priority' => 'medium',
    ])->assertSuccessful();

    expect(Task::query()->where('project_id', $project->id)->where('title', 'New Task')->exists())->toBeTrue();
});

it('updates task status successfully without events/listeners', function (): void {
    $owner = User::factory()->create();
    $assignee = User::factory()->create();
    actingAs($owner);

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Project B',
        'description' => 'Test',
        'paid_amount' => 0,
        'source' => 'local',
    ]);

    $task = Task::query()->create([
        'project_id' => $project->id,
        'title' => 'Existing Task',
        'description' => 'Desc',
        'status' => 'pending',
        'priority' => 'medium',
        'is_imported' => false,
    ]);

    // Attach an assignee for authorization of updateStatus path
    $task->assignees()->attach($assignee->id);

    put(route('task.updateStatus', ['task' => $task->id]), [
        'status' => 'completed',
        'github_update' => false,
        'jira_update' => false,
    ])->assertSuccessful();

    expect($task->fresh()->status)->toBe('completed');
});
