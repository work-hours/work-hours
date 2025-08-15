<?php

declare(strict_types=1);

use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows an authenticated user to create a tag', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/tags', [
        'name' => 'Alpha',
    ]);

    $response->assertOk()
        ->assertJsonPath('name', 'Alpha')
        ->assertJson(fn ($json) => $json->where('user_id', $user->id)->etc());

    $this->assertDatabaseHas('tags', [
        'name' => 'Alpha',
        'user_id' => $user->id,
    ]);
});

it('updates a tag name and color for the owner', function (): void {
    $user = User::factory()->create();

    $tag = Tag::query()->create([
        'name' => 'Old',
        'user_id' => $user->id,
        'color' => '#111111',
    ]);

    $response = $this->actingAs($user)->putJson("/tags/{$tag->id}", [
        'name' => 'New',
        'color' => '#123456',
    ]);

    $response->assertOk()
        ->assertJsonPath('name', 'New')
        ->assertJsonPath('color', '#123456');

    $this->assertDatabaseHas('tags', [
        'id' => $tag->id,
        'name' => 'New',
        'color' => '#123456',
    ]);
});

it('prevents updating a tag owned by another user', function (): void {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $tag = Tag::query()->create([
        'name' => 'Secret',
        'user_id' => $owner->id,
        'color' => '#222222',
    ]);

    $response = $this->actingAs($other)->putJson("/tags/{$tag->id}", [
        'name' => 'Hack',
        'color' => '#abcdef',
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('tags', [
        'id' => $tag->id,
        'name' => 'Secret',
    ]);
});

it('deletes a tag for the owner', function (): void {
    $user = User::factory()->create();

    $tag = Tag::query()->create([
        'name' => 'Disposable',
        'user_id' => $user->id,
        'color' => '#333333',
    ]);

    $response = $this->actingAs($user)->deleteJson("/tags/{$tag->id}");

    $response->assertSuccessful();

    $this->assertDatabaseMissing('tags', [
        'id' => $tag->id,
    ]);
});

it('prevents deleting a tag owned by another user', function (): void {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $tag = Tag::query()->create([
        'name' => 'KeepOut',
        'user_id' => $owner->id,
        'color' => '#444444',
    ]);

    $response = $this->actingAs($other)->deleteJson("/tags/{$tag->id}");

    $response->assertForbidden();

    $this->assertDatabaseHas('tags', [
        'id' => $tag->id,
    ]);
});
