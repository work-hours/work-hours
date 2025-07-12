<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\TimeLog;
use App\Models\User;

final class TimeLogPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TimeLog $timeLog): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TimeLog $timeLog): bool
    {
        if ($timeLog->user_id !== $user->getKey() || $timeLog->is_paid) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TimeLog $timeLog): bool
    {
        if ($timeLog->user_id !== $user->getKey() || $timeLog->is_paid) {
            return false;
        }

        return true;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TimeLog $timeLog): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TimeLog $timeLog): bool
    {
        return false;
    }
}
