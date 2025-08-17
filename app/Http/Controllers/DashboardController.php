<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Stores\ClientStore;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TaskStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;

final class DashboardController extends Controller
{
    public function index(): Response
    {
        return inertia('dashboard');
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
    public function stats(): array
    {
        $teamCount = TeamStore::teamMemberCount(userId: auth()->id());
        $clientCount = ClientStore::userClients(userId: auth()->id())->count();

        $teamMembers = TeamStore::teamMembersIds(userId: auth()->id())->merge([auth()->id()]);
        $teamMembersIds = $teamMembers->toArray();

        $totalHours = TimeLogStore::totalHours(teamMembersIds: $teamMembersIds);
        $unpaidHours = TimeLogStore::unpaidHours(teamMembersIds: $teamMembersIds);
        $unpaidAmountsByCurrency = TimeLogStore::unpaidAmount(teamMembersIds: $teamMembersIds);
        $paidAmountsByCurrency = TimeLogStore::paidAmount(teamMembersIds: $teamMembersIds);
        $dailyTrend = TimeLogStore::dailyTrend(teamMembersIds: $teamMembersIds, userId: auth()->id(), days: 7);

        return [
            'count' => $teamCount,
            'totalHours' => $totalHours,
            'unpaidHours' => $unpaidHours,
            'unpaidAmountsByCurrency' => $unpaidAmountsByCurrency,
            'paidAmountsByCurrency' => $paidAmountsByCurrency,
            'currency' => 'USD',
            'weeklyAverage' => $teamCount > 0 ? round($totalHours / $teamCount, 2) : 0,
            'clientCount' => $clientCount,
            'dailyTrend' => $dailyTrend,
        ];
    }

    #[Action(method: 'get', name: 'dashboard.projects', middleware: ['auth', 'verified'])]
    public function projects(): array
    {
        return [
            'projects' => ProjectStore::userProjects(userId: auth()->id()),
        ];
    }

    #[Action(method: 'get', name: 'dashboard.tasks', middleware: ['auth', 'verified'])]
    public function tasks(): array
    {
        return [
            'tasks' => TaskStore::userTasks(userId: auth()->id()),
        ];
    }
}
