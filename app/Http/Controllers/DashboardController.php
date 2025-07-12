<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Models\Team;
use App\Models\TimeLog;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        $teamCount = Team::query()->where('user_id', auth()->id())->count();
        $teamMembers = TeamStore::teamMembersIds(userId: auth()->id());
        $teamMembers = $teamMembers->merge([auth()->id()]);

        $last5Entries = TimeLog::query()
            ->whereIn('user_id', $teamMembers)
            ->orderBy('start_timestamp', 'desc')
            ->with('user')
            ->take(5)
            ->get(['start_timestamp', 'end_timestamp', 'duration', 'user_id']);

        $totalHours = TimeLog::query()
            ->whereIn('user_id', $teamMembers)
            ->sum('duration');

        $unpaidHours = TimeLog::query()
            ->whereIn('user_id', $teamMembers)
            ->where('is_paid', false)
            ->sum('duration');

        $unpaidAmount = 0;
        $teamMembersWithUnpaidHours = TimeLog::query()
            ->whereIn('user_id', $teamMembers)
            ->where('is_paid', false)
            ->select('user_id')
            ->distinct()
            ->get()
            ->pluck('user_id');

        foreach ($teamMembersWithUnpaidHours as $memberId) {
            $memberUnpaidHours = TimeLog::query()
                ->where('user_id', $memberId)
                ->where('is_paid', false)
                ->sum('duration');

            $hourlyRate = Team::query()
                ->where('member_id', $memberId)
                ->value('hourly_rate') ?? 0;

            $unpaidAmount += $memberUnpaidHours * $hourlyRate;
        }

        $currency = 'USD';

        $authUserCurrency = Team::query()
            ->where('member_id', auth()->id())
            ->value('currency');

        if ($authUserCurrency) {
            $currency = $authUserCurrency;
        }

        return inertia('dashboard', [
            'teamStats' => [
                'count' => $teamCount,
                'totalHours' => $totalHours,
                'unpaidHours' => $unpaidHours,
                'unpaidAmount' => round($unpaidAmount, 2),
                'currency' => $currency,
                'weeklyAverage' => $teamCount > 0 ? round($totalHours / $teamCount, 2) : 0,
                'recentLogs' => $last5Entries->map(fn ($log): array => [
                    'date' => $log->start_timestamp->format('Y-m-d H:i:s'),
                    'user' => $log->user->name ?? 'Unknown User',
                    'hours' => $log->duration,
                ]),
                'allLogsLink' => route('team.all-time-logs'),
            ],
        ]);
    }

    #[Action(method: 'get', name: 'dashboard.recent-logs', middleware: ['auth', 'verified'])]
    public function recentLogs(): array
    {
        sleep(5);

        $teamMembers = TeamStore::teamMembersIds(userId: auth()->id());
        $teamMembers = $teamMembers->merge([auth()->id()]);

        return [
            'entries' => TimeLogStore::recentTeamLogs(
                teamMembersIds: $teamMembers->toArray(),
            )->map(fn ($log): array => [
                'date' => $log->start_timestamp->format('Y-m-d H:i:s'),
                'user' => $log->user->name ?? 'Unknown User',
                'hours' => $log->duration,
            ]),
            'allLogsLink' => route('team.all-time-logs'),
        ];
    }
}
