<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

uses(RefreshDatabase::class);

it('requires due_date when is_recurring is true on store', function (): void {
    $user = User::factory()->create();

    $project = Project::query()->create([
        'user_id' => $user->id,
        'name' => 'Proj',
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
        'is_recurring' => true,
        'recurring_frequency' => 'weekly',
    ];

    $resp = postJson(route('task.store'), $payload);

    $resp->assertStatus(422);
    $resp->assertJsonValidationErrors(['due_date']);
});
