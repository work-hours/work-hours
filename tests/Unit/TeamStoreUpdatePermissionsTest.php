<?php

declare(strict_types=1);

use App\Http\Stores\TeamStore;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('ignores permissions key when updating a team member user', function (): void {
    // Arrange: create owner and member users
    /** @var User $owner */
    $owner = User::factory()->create();
    /** @var User $member */
    $member = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    // And they have a team relation
    Team::query()->create([
        'user_id' => $owner->id,
        'member_id' => $member->id,
        'hourly_rate' => 0,
        'currency' => 'USD',
        'non_monetary' => true,
        'is_employee' => true,
    ]);

    // Act: attempt to update member with a permissions payload (should be ignored by TeamStore)
    $result = TeamStore::updateMemberForUser($owner->id, $member, [
        'name' => 'New Name',
        'email' => 'new@example.com',
        'hourly_rate' => 0,
        'currency' => 'USD',
        'non_monetary' => true,
        'is_employee' => true,
        'permissions' => [1, 2, 3],
    ]);

    // Assert: no exception thrown and user updated
    expect($result['password_changed'])->toBeFalse();
    $member->refresh();
    expect($member->name)->toBe('New Name');
    expect($member->email)->toBe('new@example.com');
});
