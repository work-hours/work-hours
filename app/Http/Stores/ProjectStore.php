<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Project;
use Illuminate\Support\Collection;

final class ProjectStore
{
    public static function userProjects(int $userId): Collection
    {
        $ownedProjects = Project::query()
            ->where('user_id', $userId)
            ->with(['teamMembers', 'user'])
            ->get();

        $assignedProjects = Project::query()
            ->whereHas('teamMembers', function ($query) use ($userId): void {
                $query->where('users.id', $userId);
            })
            ->where('user_id', '!=', $userId)
            ->with(['teamMembers', 'user'])
            ->get();

        return $ownedProjects->concat($assignedProjects);
    }
}
