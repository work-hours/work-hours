<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Team;
use App\Models\TimeLog;
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

    public static function teamEntry(int $userId, int $memberId): ?Team
    {
        return Team::query()
            ->where('user_id', $userId)
            ->where('member_id', $memberId)
            ->first();
    }
}
