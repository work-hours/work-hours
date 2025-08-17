<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

it('returns only the current user as potential assignee for non-owner', function (): void {
    $owner = User::factory()->create();
    $member = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Test Project',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);

    $project->teamMembers()->attach($member->id);

    actingAs($member);

    $response = getJson(route('task.potential-assignees', $project->id));

    $response->assertSuccessful();
    $response->assertJsonCount(1);
    $response->assertJsonFragment(['id' => $member->id]);
});

it('forces non-owner to assign only themselves on task create', function (): void {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $other = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Test Project 2',
        'description' => 'desc',
        'paid_amount' => 0,
    ]);
    $project->teamMembers()->attach($member->id);

    actingAs($member);

    $payload = [
        'project_id' => $project->id,
        'title' => 'Some Task',
        'description' => 'Task desc',
        'status' => 'pending',
        'priority' => 'medium',
        'due_date' => now()->toDateString(),
        // Attempt to assign others
        'assignees' => [$owner->id, $other->id],
    ];

    $resp = postJson(route('task.store'), $payload);

    $resp->assertSuccessful();

    $task = Task::query()->latest()->first();
    expect($task)->not->toBeNull();

    $assigneeIds = $task->assignees()->pluck('users.id')->all();
    expect($assigneeIds)->toBe([$member->id]);
});
