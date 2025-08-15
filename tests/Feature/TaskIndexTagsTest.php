<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('only includes tags associated with tasks from user\'s available projects on task index', function (): void {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    // Owner's project with two tagged tasks
    $projectA = Project::query()->create([
        'user_id' => $owner->id,
        'name' => 'Project A',
        'description' => 'Desc A',
        'paid_amount' => 0,
    ]);

    $taskA1 = Task::query()->create([
        'project_id' => $projectA->id,
        'title' => 'Task A1',
        'status' => 'pending',
        'priority' => 'medium',
    ]);

    $taskA2 = Task::query()->create([
        'project_id' => $projectA->id,
        'title' => 'Task A2',
        'status' => 'pending',
        'priority' => 'medium',
    ]);

    $tag1 = Tag::query()->create(['name' => 'Tag 1', 'user_id' => $owner->id, 'color' => '#000000']);
    $tag2 = Tag::query()->create(['name' => 'Tag 2', 'user_id' => $owner->id, 'color' => '#111111']);

    $taskA1->tags()->sync([$tag1->id]);
    $taskA2->tags()->sync([$tag2->id]);

    // Another user's project (not available) with its tag
    $projectB = Project::query()->create([
        'user_id' => $other->id,
        'name' => 'Project B',
        'description' => 'Desc B',
        'paid_amount' => 0,
    ]);

    $taskB1 = Task::query()->create([
        'project_id' => $projectB->id,
        'title' => 'Task B1',
        'status' => 'pending',
        'priority' => 'medium',
    ]);

    $tag3 = Tag::query()->create(['name' => 'Tag 3', 'user_id' => $other->id, 'color' => '#222222']);
    $taskB1->tags()->sync([$tag3->id]);

    // A project where owner is a team member (available) with its tag
    $projectC = Project::query()->create([
        'user_id' => $other->id,
        'name' => 'Project C',
        'description' => 'Desc C',
        'paid_amount' => 0,
    ]);
    // Attach owner as team member on projectC
    $projectC->teamMembers()->attach($owner->id);

    $taskC1 = Task::query()->create([
        'project_id' => $projectC->id,
        'title' => 'Task C1',
        'status' => 'pending',
        'priority' => 'medium',
    ]);

    $tag4 = Tag::query()->create(['name' => 'Tag 4', 'user_id' => $owner->id, 'color' => '#333333']);
    $taskC1->tags()->sync([$tag4->id]);

    $this->actingAs($owner)
        ->get(route('task.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('task/index')
            ->has('tags')
            ->where('tags', function ($tags) use ($tag1, $tag2, $tag4, $tag3): bool {
                $ids = collect($tags)->pluck('id');
                // includes tag1, tag2, tag4
                $includes = $ids->contains($tag1->id) && $ids->contains($tag2->id) && $ids->contains($tag4->id);
                // excludes tag3
                $excludes = $ids->doesntContain($tag3->id);

                return $includes && $excludes;
            })
        );
});
