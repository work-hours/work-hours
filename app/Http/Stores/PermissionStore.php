<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Permission;
use Illuminate\Support\Collection;

final class PermissionStore
{
    /**
     * Fetch all permissions and group them by module, returning a shape
     * suitable for the frontend props.
     *
     * @return array<string, array<int, array{id: int, name: string, description: string|null}>>
     */
    public static function permissionsByModule(): array
    {
        $permissions = Permission::query()
            ->orderBy('module')
            ->orderBy('name')
            ->get();

        return self::mapPermissionsByModule($permissions);
    }

    /**
     * Map a collection of permissions into grouped arrays by module.
     *
     * @param  Collection<int, object>  $permissions  Objects with id, name, description, module
     * @return array<string, array<int, array{id: int, name: string, description: string|null}>>
     */
    public static function mapPermissionsByModule(Collection $permissions): array
    {
        return $permissions
            ->groupBy(static fn ($perm): string => (string) ($perm->module ?? 'General'))
            ->map(static fn (Collection $group) => $group->map(static fn ($perm): array => [
                'id' => (int) $perm->id,
                'name' => (string) $perm->name,
                'description' => $perm->description !== null ? (string) $perm->description : null,
            ])->values()->all())
            ->toArray();
    }
}
