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
        $teamCount = TeamStore::teamMemberCount(userId: auth()->id());
        $teamMembers = TeamStore::teamMembersIds(userId: auth()->id())->merge([auth()->id()]);
        $totalHours = TimeLogStore::totalHours(teamMembersIds: $teamMembers->toArray());
        $unpaidHours = TimeLogStore::unpaidHours(teamMembersIds: $teamMembers->toArray());
        $unpaidAmount = TimeLogStore::unpaidAmount(teamMembersIds: $teamMembers->toArray());
        $currency = 'USD';

        return inertia('dashboard', [
            'teamStats' => [
                'count' => $teamCount,
                'totalHours' => $totalHours,
                'unpaidHours' => $unpaidHours,
                'unpaidAmount' => round($unpaidAmount, 2),
                'currency' => $currency,
                'weeklyAverage' => $teamCount > 0 ? round($totalHours / $teamCount, 2) : 0,
            ],
        ]);
    }

    #[Action(method: 'get', name: 'dashboard.recent-logs', middleware: ['auth', 'verified'])]
    public function recentLogs(): array
    {
        return [
            'entries' => TimeLogStore::recentTeamLogs(
                teamMembersIds: (TeamStore::teamMembersIds(userId: auth()->id())->merge([auth()->id()])->toArray()),
            )->map(fn ($log): array => [
                'date' => $log->start_timestamp->format('Y-m-d H:i:s'),
                'user' => $log->user->name ?? 'Unknown User',
                'hours' => $log->duration,
            ]),
            'allLogsLink' => route('team.all-time-logs'),
        ];
    }

    #[Action(method: 'get', name: 'dashboard.stats', middleware: ['auth', 'verified'])]
    public function stats()
    {
        $teamCount = TeamStore::teamMemberCount(userId: auth()->id());
        $teamMembers = TeamStore::teamMembersIds(userId: auth()->id())->merge([auth()->id()]);
        $totalHours = TimeLogStore::totalHours(teamMembersIds: $teamMembers->toArray());
        $unpaidHours = TimeLogStore::unpaidHours(teamMembersIds: $teamMembers->toArray());
        $unpaidAmount = TimeLogStore::unpaidAmount(teamMembersIds: $teamMembers->toArray());

        return [
            'count' => $teamCount,
            'totalHours' => $totalHours,
            'unpaidHours' => $unpaidHours,
            'unpaidAmount' => round($unpaidAmount, 2),
            'currency' => 'USD',
            'weeklyAverage' => $teamCount > 0 ? round($totalHours / $teamCount, 2) : 0,
        ];
    }
}
