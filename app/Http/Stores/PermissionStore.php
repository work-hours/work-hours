<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Permission;
use App\Models\User;
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

    /**
     * Get the current user's Team permission names.
     *
     * @return list<string>
     */
    public static function userTeamPermissionNames(User $user): array
    {
        return $user->permissions()
            ->where('module', 'Team')
            ->pluck('name')
            ->toArray();
    }

    /**
     * Check whether the user has a specific Team permission.
     */
    public static function userHasTeamPermission(User $user, string $name): bool
    {
        return $user->permissions()
            ->where('module', 'Team')
            ->where('name', $name)
            ->exists();
    }
}
