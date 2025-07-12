<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Team;
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

    public static function totalHours(array $teamMembersIds): float
    {
        return TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->sum('duration');
    }

    public static function unpaidHours(array $teamMembersIds)
    {
        return TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->where('is_paid', false)
            ->sum('duration');
    }

    public static function unpaidTimeLog(int $teamMemberId): Collection
    {
        return TimeLog::query()
            ->with('project')
            ->where('user_id', $teamMemberId)
            ->where('is_paid', false)
            ->get();
    }

    public static function unpaidAmount(array $teamMembersIds): float
    {
        $unpaidAmount = 0;
        foreach ($teamMembersIds as $memberId) {
            $unpaidLogs = self::unpaidTimeLog(teamMemberId: $memberId);
            $unpaidLogs->each(function ($log) use (&$unpaidAmount, $memberId): void {
                $memberUnpaidHours = $log->duration;
                $hourlyRate = Team::memberHourlyRate(project: $log->project, memberId: $memberId);

                if ($hourlyRate) {
                    $unpaidAmount += $memberUnpaidHours * $hourlyRate;
                }
            });
        }

        return round($unpaidAmount, 2);
    }
}
