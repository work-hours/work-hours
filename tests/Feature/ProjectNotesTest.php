<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\ProjectNote;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeProject(User $owner): Project
{
    return Project::query()->create([
        'user_id' => $owner->getKey(),
        'name' => 'Test Project',
        'description' => 'Desc',
    ]);
}

it('lists notes for owner and team member, forbids unrelated user', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $stranger = User::factory()->create();
    $project = makeProject($owner);
    $project->teamMembers()->attach($member->getKey());

    // seed notes
    $n1 = ProjectNote::query()->create(['project_id' => $project->id, 'user_id' => $owner->id, 'body' => 'Owner note']);
    $n2 = ProjectNote::query()->create(['project_id' => $project->id, 'user_id' => $member->id, 'body' => 'Member note']);

    // Owner can list
    $this->actingAs($owner)
        ->getJson(route('project.notes', $project))
        ->assertSuccessful()
        ->assertJsonFragment(['body' => 'Owner note'])
        ->assertJsonFragment(['body' => 'Member note']);

    // Team member can list
    $this->actingAs($member)
        ->getJson(route('project.notes', $project))
        ->assertSuccessful();

    // Stranger forbidden
    $this->actingAs($stranger)
        ->getJson(route('project.notes', $project))
        ->assertForbidden();
});

it('allows owner or team member to create note and validates body', function () {
    $owner = User::factory()->create();
    $member = User::factory()->create();
    $stranger = User::factory()->create();
    $project = makeProject($owner);
    $project->teamMembers()->attach($member->getKey());

    // Validation fails
    $this->actingAs($owner)
        ->post(route('project.notes.store', $project), [])
        ->assertSessionHasErrors(['body']);

    // Owner can create
    $this->actingAs($owner)
        ->post(route('project.notes.store', $project), ['body' => 'Note by owner'])
        ->assertRedirect();

    expect(ProjectNote::query()->where('project_id', $project->id)->count())->toBe(1);

    // Team member can create
    $this->actingAs($member)
        ->post(route('project.notes.store', $project), ['body' => 'Note by member'])
        ->assertRedirect();

    expect(ProjectNote::query()->where('project_id', $project->id)->count())->toBe(2);

    // Stranger cannot create
    $this->actingAs($stranger)
        ->post(route('project.notes.store', $project), ['body' => 'bad'])
        ->assertForbidden();
});

it('allows creator or owner to update and delete, forbids others', function () {
    $owner = User::factory()->create();
    $creator = User::factory()->create();
    $member = User::factory()->create();
    $stranger = User::factory()->create();
    $project = makeProject($owner);
    $project->teamMembers()->attach($member->getKey());

    $note = ProjectNote::query()->create(['project_id' => $project->id, 'user_id' => $creator->id, 'body' => 'original']);

    // Creator can update
    $this->actingAs($creator)
        ->put(route('project.notes.update', ['project' => $project->id, 'note' => $note->id]), ['body' => 'updated'])
        ->assertRedirect();

    expect($note->refresh()->body)->toBe('updated');

    // Owner can update
    $this->actingAs($owner)
        ->put(route('project.notes.update', ['project' => $project->id, 'note' => $note->id]), ['body' => 'owner-updated'])
        ->assertRedirect();

    expect($note->refresh()->body)->toBe('owner-updated');

    // Member (not creator) cannot update
    $this->actingAs($member)
        ->put(route('project.notes.update', ['project' => $project->id, 'note' => $note->id]), ['body' => 'nope'])
        ->assertForbidden();

    // Stranger cannot delete
    $this->actingAs($stranger)
        ->delete(route('project.notes.destroy', ['project' => $project->id, 'note' => $note->id]))
        ->assertForbidden();

    // Creator can delete
    $this->actingAs($creator)
        ->delete(route('project.notes.destroy', ['project' => $project->id, 'note' => $note->id]))
        ->assertRedirect();

    expect(ProjectNote::query()->find($note->id))->toBeNull();
});

it('returns latest notes first', function () {
    $owner = User::factory()->create();
    $project = makeProject($owner);

    $first = ProjectNote::query()->create(['project_id' => $project->id, 'user_id' => $owner->id, 'body' => 'first']);
    sleep(1);
    $second = ProjectNote::query()->create(['project_id' => $project->id, 'user_id' => $owner->id, 'body' => 'second']);

    $response = $this->actingAs($owner)->getJson(route('project.notes', $project))->assertSuccessful();

    $data = $response->json();
    expect($data[0]['body'])->toBe('second');
    expect($data[1]['body'])->toBe('first');
});
