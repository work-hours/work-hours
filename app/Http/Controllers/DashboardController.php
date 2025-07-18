<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Stores\ClientStore;
use App\Http\Stores\ProjectStore;
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
        $teamMembers = TeamStore::teamMembersIds(userId: auth()->id())->merge([auth()->id()]);
        $totalHours = TimeLogStore::totalHours(teamMembersIds: $teamMembers->toArray());
        $unpaidHours = TimeLogStore::unpaidHours(teamMembersIds: $teamMembers->toArray());
        $unpaidAmountsByCurrency = TimeLogStore::unpaidAmount(teamMembersIds: $teamMembers->toArray());
        $paidAmountsByCurrency = TimeLogStore::paidAmount(teamMembersIds: $teamMembers->toArray());
        $clientCount = ClientStore::userClients(userId: auth()->id())->count();

        // For backward compatibility, calculate total unpaid amount
        $totalUnpaidAmount = array_sum($unpaidAmountsByCurrency);
        // For backward compatibility, calculate total paid amount
        $totalPaidAmount = array_sum($paidAmountsByCurrency);

        return [
            'count' => $teamCount,
            'totalHours' => $totalHours,
            'unpaidHours' => $unpaidHours,
            'unpaidAmount' => round($totalUnpaidAmount, 2),
            'unpaidAmountsByCurrency' => $unpaidAmountsByCurrency,
            'paidAmount' => round($totalPaidAmount, 2),
            'paidAmountsByCurrency' => $paidAmountsByCurrency,
            'currency' => 'USD',
            'weeklyAverage' => $teamCount > 0 ? round($totalHours / $teamCount, 2) : 0,
            'clientCount' => $clientCount,
        ];
    }

    #[Action(method: 'get', name: 'dashboard.projects', middleware: ['auth', 'verified'])]
    public function projects(): array
    {
        return [
            'projects' => ProjectStore::userProjects(userId: auth()->id()),
        ];
    }
}
