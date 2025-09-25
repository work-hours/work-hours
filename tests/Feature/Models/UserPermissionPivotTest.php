<?php

declare(strict_types=1);

use App\Models\Permission;
use App\Models\User;
use App\Models\UserPermission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates a pivot record when attaching a permission to a user', function (): void {
    $user = User::factory()->create();

    $permission = Permission::query()->create([
        'module' => 'tasks',
        'name' => 'approve-tasks',
        'description' => 'Approve submitted tasks',
    ]);

    $user->permissions()->attach($permission->id);

    $pivot = UserPermission::query()
        ->where('user_id', $user->id)
        ->where('permission_id', $permission->id)
        ->first();

    expect($pivot)->not->toBeNull();
    expect($pivot->user->is($user))->toBeTrue();
    expect($pivot->permission->is($permission))->toBeTrue();
});
