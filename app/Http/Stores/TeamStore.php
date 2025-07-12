<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Http\QueryFilters\ProjectTimeLog\EndDateFilter;
use App\Http\QueryFilters\ProjectTimeLog\IsPaidFilter;
use App\Http\QueryFilters\ProjectTimeLog\ProjectIdFilter;
use App\Http\QueryFilters\ProjectTimeLog\StartDateFilter;
use App\Http\QueryFilters\ProjectTimeLog\TeamMemberIdFilter;
use App\Models\Team;
use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Collection;

final class TeamStore
{
    public static function teamMembersIds(int $userId): Collection
    {
        return Team::query()->where('user_id', $userId)->pluck('member_id');
    }

    public static function teamMemberCount(int $userId): int
    {
        return Team::query()->where('user_id', $userId)->count();
    }

    public static function teamMembers(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Team::query()
            ->where('user_id', $userId)
            ->with('member')
            ->get();
    }

    public static function allTeamMemberTimeLogs(Collection $teamMemberIds): Collection
    {
        return app(Pipeline::class)
            ->send(TimeLog::query()->whereIn('user_id', $teamMemberIds))
            ->through([
                StartDateFilter::class,
                EndDateFilter::class,
                TeamMemberIdFilter::class,
                ProjectIdFilter::class,
                IsPaidFilter::class,
            ])
            ->thenReturn()
            ->with(['user', 'project'])
            ->get();
    }

    public static function teamMemberTimeLogs(int $memberId): Collection
    {
        return app(Pipeline::class)
            ->send(TimeLog::query()->where('user_id', $memberId))
            ->through([
                StartDateFilter::class,
                EndDateFilter::class,
                ProjectIdFilter::class,
                IsPaidFilter::class,
            ])
            ->thenReturn()
            ->with('project')
            ->get();
    }

    public static function unpaidAmount(Collection $timeLogs, float $hourlyRate): float
    {
        $unpaidAmount = 0;
        $timeLogs->each(function (TimeLog $timeLog) use (&$unpaidAmount, $hourlyRate): void {
            if (! $timeLog['is_paid']) {
                $unpaidAmount += $timeLog['duration'] * $hourlyRate;
            }
        });

        return round($unpaidAmount, 2);
    }

    public static function timeLogMapper(Collection $timeLogs): Collection
    {
        return $timeLogs->map(fn ($timeLog): array => [
            'id' => $timeLog->id,
            'user_id' => $timeLog->user_id,
            'project_id' => $timeLog->project_id,
            'project_name' => $timeLog->project ? $timeLog->project->name : null,
            'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
            'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
            'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
            'is_paid' => $timeLog->is_paid,
        ]);
    }
}
