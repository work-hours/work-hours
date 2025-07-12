<?php

declare(strict_types=1);

namespace App\Policies;

use App\Http\Stores\ProjectStore;
use App\Models\Team;
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
        return Team::query()->where('user_id', $user->getKey())->where('member_id', $member->getKey())->exists();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, User $member): bool
    {
        return Team::query()->where('user_id', $user->getKey())->where('member_id', $member->getKey())->exists();
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

        return Team::query()->where('user_id', $user->getKey())->where('member_id', $member->getKey())->exists();
    }
}
