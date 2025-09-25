<?php

declare(strict_types=1);

namespace App\Http\Mappers\Team;

use App\Enums\TimeLogStatus;
use App\Http\Stores\TimeLogStore;
use App\Models\Team;
use App\Models\TimeLog;

final class TeamListMapper
{
    public static function map(Team $team): array
    {
        $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('user_id', $team->member->getkey()));
        $mappedTimeLogs = TimeLogStore::timeLogMapper($timeLogs);

        $approvedLogs = $mappedTimeLogs->where('status', TimeLogStatus::APPROVED);
        $totalDuration = round($approvedLogs->sum('duration'), 2);
        $unpaidHours = round($approvedLogs->where('is_paid', false)->sum('duration'), 2);
        $unpaidAmountsByCurrency = TimeLogStore::unpaidAmountFromLogs(timeLogs: $timeLogs);
        $currency = $team->currency ?? 'USD';
        $unpaidAmount = isset($unpaidAmountsByCurrency[$currency])
            ? (float) $unpaidAmountsByCurrency[$currency]
            : (float) array_sum($unpaidAmountsByCurrency);
        $unpaidAmount = round($unpaidAmount, 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        return [
            'id' => $team->member->getKey(),
            'name' => $team->member->name,
            'email' => $team->member->email,
            'hourly_rate' => $team->hourly_rate,
            'currency' => $team->currency,
            'non_monetary' => (bool) $team->non_monetary,
            'is_employee' => (bool) ($team->is_employee ?? false),
            'permissions' => $team->member->permissions?->pluck('id')->map(fn ($id) => (int) $id)->values()->all() ?? [],
            'totalHours' => $totalDuration,
            'weeklyAverage' => $weeklyAverage,
            'unpaidHours' => $unpaidHours,
            'unpaidAmount' => $unpaidAmount,
        ];
    }
}
