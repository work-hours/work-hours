<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\TimeLog;
use Illuminate\Database\Eloquent\Collection;

final class TimeLogStore
{
    public static function recentTeamLogs(array $teamMembersIds, int $limit = 5): Collection
    {
        return TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->orderBy('start_timestamp', 'desc')
            ->with('user')
            ->take($limit)
            ->get(['start_timestamp', 'end_timestamp', 'duration', 'user_id']);
    }
}
