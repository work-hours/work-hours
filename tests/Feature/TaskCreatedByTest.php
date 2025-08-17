<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

it('sets created_by to the authenticated user when creating a task', function (): void {
    $user = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $user->id,
        'name' => 'My Project',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    actingAs($user);

    $payload = [
        'project_id' => $project->id,
        'title' => 'New Task',
        'description' => 'Body',
        'status' => 'pending',
        'priority' => 'medium',
        'due_date' => now()->toDateString(),
    ];

    $resp = postJson(route('task.store'), $payload);

    $resp->assertSuccessful();

    /** @var Task $task */
    $task = Task::query()->latest()->first();

    expect($task)->not->toBeNull();
    expect($task->created_by)->toBe($user->id);
});
