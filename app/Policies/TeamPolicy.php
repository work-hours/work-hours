<?php

declare(strict_types=1);

namespace App\Policies;

use App\Http\Stores\PermissionStore;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Models\User;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class TeamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, User $member): bool
    {
        return TeamStore::isLeaderOfMemberIds($user->getKey(), $member->getKey());
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $member): bool
    {
        return TeamStore::isLeaderOfMemberIds($user->getKey(), $member->getKey());
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(): bool
    {
        return false;
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function viewTimeLogs(User $user, User $member): bool
    {
        $response = true;
        if (request()->get('project_id') && request('project_id')) {
            $response = in_array(request('project_id'), ProjectStore::userProjects(userId: $user->getKey())->pluck('id')->toArray());
        }

        if (! $response) {
            return false;
        }
        if (TeamStore::isLeaderOfMemberIds($user->getKey(), $member->getKey())) {
            return true;
        }
        $employeeLeaderId = TeamStore::employeeLeaderIdFor($user->getKey());
        if ($employeeLeaderId) {
            $hasViewLogsPermission = PermissionStore::userHasTeamPermission($user, 'View Time Logs');
            if (! $hasViewLogsPermission) {
                return false;
            }

            return TeamStore::isLeaderOfMemberIds((int) $employeeLeaderId, $member->getKey());
        }

        return false;
    }
}
