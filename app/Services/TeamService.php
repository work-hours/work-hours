<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Stores\PermissionStore;
use App\Http\Stores\TeamStore;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final readonly class TeamService
{
    /**
     * Paginate a base Eloquent query and also retrieve the full filtered collection.
     *
     * @return array{0: LengthAwarePaginator, 1: Collection}
     */
    public function paginateWithFull(Builder $baseQuery, int $perPage = 15): array
    {
        $paginated = (clone $baseQuery)
            ->paginate($perPage)
            ->appends(request()->query());

        $allFiltered = (clone $baseQuery)->get();

        return [$paginated, $allFiltered];
    }

    /**
     * Build a CSV filename with the current date using the given prefix.
     */
    public function csvDateFilename(string $prefix): string
    {
        return $prefix . '_' . Carbon::now()->format('Y-m-d') . '.csv';
    }

    /**
     * Determine the applicable leader/user ID for listing-like actions, enforcing a permission when the
     * authenticated user is acting under a leader.
     */
    public function leaderIdForActionWithPermission(User $authUser, string $permission, string $forbiddenMessage): ?int
    {
        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());

        if (! $employeeLeaderId) {
            return null;
        }

        $hasPermission = PermissionStore::userHasTeamPermission($authUser, $permission);
        abort_unless($hasPermission, 403, $forbiddenMessage);

        return (int) $employeeLeaderId;
    }

    /**
     * When the authenticated user is an employee under a leader, ensure they have the given permission.
     */
    public function ensureEmployeeHasPermission(User $authUser, string $permission, string $forbiddenMessage): void
    {
        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());
        if ($employeeLeaderId) {
            $hasPermission = PermissionStore::userHasTeamPermission($authUser, $permission);
            abort_unless($hasPermission, 403, $forbiddenMessage);
        }
    }

    /**
     * Resolve the owner/leader ID for member-targeted actions (update/delete), applying authorization rules.
     */
    public function resolveOwnerIdForMemberAction(User $authUser, User $targetUser, string $permission, string $unauthorizedMessage): int
    {
        $ownerUserId = (int) $authUser->getKey();

        $isLeaderOfMember = TeamStore::isLeaderOfMemberIds($authUser->getKey(), $targetUser->getKey());
        if ($isLeaderOfMember) {
            return $ownerUserId;
        }

        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());
        abort_unless($employeeLeaderId, 403, $unauthorizedMessage);

        $hasPermission = PermissionStore::userHasTeamPermission($authUser, $permission);
        $targetUnderLeader = TeamStore::isLeaderOfMemberIds((int) $employeeLeaderId, $targetUser->getKey());
        abort_if(! $hasPermission || ! $targetUnderLeader, 403, $unauthorizedMessage);

        return (int) $employeeLeaderId;
    }

    /**
     * Apply permissions for a user based on their employee status.
     * - If isEmployee is true and permissions provided, sync them.
     * - If isEmployee is false, detach all permissions.
     */
    public function applyEmployeePermissions(User $user, bool $isEmployee, ?array $permissions = null): void
    {
        if ($isEmployee) {
            if (is_array($permissions)) {
                $user->permissions()->sync($permissions);
            }

            return;
        }

        $user->permissions()->detach();
    }
}
