<?php

declare(strict_types=1);

use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('can create a permission and attach it to a user', function (): void {
    $user = User::factory()->create();

    $permission = Permission::query()->create([
        'module' => 'projects',
        'name' => 'manage-projects',
        'description' => 'Manage all projects',
    ]);

    expect($permission->id)->toBeInt();

    $user->permissions()->attach($permission->id);

    expect($user->permissions()->count())->toBe(1);
    expect($permission->users()->count())->toBe(1);
});
