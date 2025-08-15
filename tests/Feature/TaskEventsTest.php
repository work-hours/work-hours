<?php

declare(strict_types=1);

use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

use App\Events\TaskCreated;
use App\Events\TaskUpdated;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Support\Facades\Event;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

it('dispatches TaskCreated event when storing a task', function (): void {
    Event::fake();

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
    ])->assertSuccessful();

    Event::assertDispatched(TaskCreated::class);
});

it('dispatches TaskUpdated event when updating task status', function (): void {
    Event::fake();

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

    Event::assertDispatched(TaskUpdated::class);
});
