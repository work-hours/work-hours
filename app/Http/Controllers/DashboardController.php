<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Stores\ClientStore;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TaskStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use Carbon\Carbon;
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
        $ownerId = (int) auth()->id();

        $totalHours = TimeLogStore::totalHours(teamMembersIds: $teamMembersIds, projectOwnerId: $ownerId);
        $unpaidHours = TimeLogStore::unpaidHours(teamMembersIds: $teamMembersIds, projectOwnerId: $ownerId);
        $unbillableHours = TimeLogStore::unbillableHours(teamMembersIds: $teamMembersIds, projectOwnerId: $ownerId);
        $unpaidAmountsByCurrency = TimeLogStore::unpaidAmount(teamMembersIds: $teamMembersIds, projectOwnerId: $ownerId);
        $paidAmountsByCurrency = TimeLogStore::paidAmount(teamMembersIds: $teamMembersIds, projectOwnerId: $ownerId);

        $startDateStr = request('start-date');
        $endDateStr = request('end-date');
        $startDate = $startDateStr ? Carbon::parse($startDateStr)->startOfDay() : null;
        $endDate = $endDateStr ? Carbon::parse($endDateStr)->endOfDay() : null;

        $dailyTrend = TimeLogStore::dailyTrend(
            teamMembersIds: $teamMembersIds,
            userId: $ownerId,
            days: 7,
            startDate: $startDate,
            endDate: $endDate,
            projectOwnerId: $ownerId,
        );

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
            'unbillableHours' => $unbillableHours,
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
