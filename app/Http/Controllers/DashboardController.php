<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\TimeLog;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        $teamCount = Team::query()->where('user_id', auth()->id())->count();
        $teamMembers = Team::query()->where('user_id', auth()->id())->pluck('member_id');
        // merge the authenticated user into the team members list
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

        return inertia('dashboard', [
            'teamStats' => [
                'count' => $teamCount,
                'totalHours' => $totalHours,
                'unpaidHours' => $unpaidHours,
                'weeklyAverage' => $teamCount > 0 ? round($totalHours / $teamCount, 2) : 0,
                'recentLogs' => $last5Entries->map(function ($log) {
                    return [
                        'date' => $log->start_timestamp->format('Y-m-d H:i:s'),
                        'user' => $log->user->name ?? 'Unknown User',
                        'hours' => $log->duration,
                    ];
                }),
                'allLogsLink' => route('team.all-time-logs'),
            ],
        ]);
    }
}
