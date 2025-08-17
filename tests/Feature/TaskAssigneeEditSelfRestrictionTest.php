<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

uses(RefreshDatabase::class);

it('prevents a non-owner from removing their own assignment during task update', function (): void {
    $owner = User::factory()->create();
    $creator = User::factory()->create();
    $other = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Project',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    // Task created by creator under owner's project and assigned to creator initially
    /** @var Task $task */
    $task = Task::query()->create([
        'project_id' => $project->id,
        'created_by' => $creator->id,
        'title' => 'Task',
        'description' => null,
        'status' => 'pending',
        'priority' => 'medium',
    ]);
    $task->assignees()->sync([$creator->id]);

    actingAs($creator);

    // Attempt to remove own assignment by sending assignees without self
    $resp = post(route('task.update', $task->id), [
        'project_id' => $project->id,
        'title' => 'Task',
        'description' => null,
        'status' => 'pending',
        'priority' => 'medium',
        'due_date' => null,
        'assignees' => [$other->id],
    ]);

    $resp->assertSuccessful();

    $task->refresh();
    expect($task->assignees()->pluck('users.id')->all())
        ->toContain($creator->id);
});
