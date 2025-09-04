<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

it('includes recurring fields in task list payload', function (): void {
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
        'title' => 'Recurring Task',
        'description' => 'Body',
        'status' => 'pending',
        'priority' => 'medium',
        'due_date' => now()->toDateString(),
        'is_recurring' => true,
        'recurring_frequency' => 'weekly',
    ]);

    actingAs($user);

    $resp = getJson(route('task.list'));

    $resp->assertSuccessful();
    $resp->assertJsonFragment([
        'id' => $task->id,
        'title' => 'Recurring Task',
        'is_recurring' => true,
        'recurring_frequency' => 'weekly',
    ]);
});
