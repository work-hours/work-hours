<?php

declare(strict_types=1);

use App\Http\Stores\PermissionStore;
use Illuminate\Support\Collection;

it('maps permissions by module including General fallback', function (): void {
    $permissions = new Collection([
        (object) ['id' => 1, 'module' => 'Team', 'name' => 'Create', 'description' => 'Create team'],
        (object) ['id' => 2, 'module' => 'Team', 'name' => 'List', 'description' => null],
        (object) ['id' => 3, 'module' => null, 'name' => 'Misc', 'description' => 'Other'],
    ]);

    $grouped = PermissionStore::mapPermissionsByModule($permissions);

    expect($grouped)->toHaveKey('Team');
    expect($grouped)->toHaveKey('General');

    expect($grouped['Team'])
        ->toBeArray()
        ->and($grouped['Team'][0])
        ->toMatchArray([
            'id' => 1,
            'name' => 'Create',
            'description' => 'Create team',
        ]);

    expect($grouped['General'][0])
        ->toMatchArray([
            'id' => 3,
            'name' => 'Misc',
            'description' => 'Other',
        ]);
});
