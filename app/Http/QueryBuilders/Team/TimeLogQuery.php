<?php

declare(strict_types=1);

namespace App\Http\QueryBuilders\Team;

use App\Http\QueryBuilders\TimeLog\FilterTimeLogQuery;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

final class TimeLogQuery
{
    public static function builder(int $userId, ?User $member = null): Builder
    {
        $projects = ProjectStore::userProjects(userId: $userId);

        $query = TimeLog::query()->whereIn('project_id', $projects->pluck('id'));

        if ($member instanceof User) {
            $query->where('user_id', $member->getKey());
        } else {
            $query->whereIn('user_id', TeamStore::teamMembersIds(userId: $userId));
        }

        return FilterTimeLogQuery::builder(baseQuery: $query);
    }
}
