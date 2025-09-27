<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Task;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

final class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $userCount = User::query()->count();
        $timeLogCount = TimeLog::query()->count();
        $projectCount = Project::query()->count();
        $clientCount = Client::query()->count();
        $invoiceCount = Invoice::query()->count();
        $tasksCount = Task::query()->count();
        $totalHoursLogged = (float) TimeLog::query()->sum('duration');

        // Build a 30-day registration trend for email-verified users only
        $start = Carbon::now()->subDays(29)->startOfDay();
        $end = Carbon::now()->endOfDay();

        /** @var Collection<int, array{date: string, count: int}> $verifiedByDay */
        $verifiedByDay = User::query()
            ->whereNotNull('email_verified_at')
            ->whereBetween('email_verified_at', [$start, $end])
            ->selectRaw('DATE(email_verified_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row): array => [
                'date' => (string) $row->date,
                'count' => (int) $row->count,
            ]);

        // Normalize to include days with zero count (users)
        $userTrend = collect();
        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $dateKey = $d->toDateString();
            $count = (int) ($verifiedByDay->firstWhere('date', $dateKey)['count'] ?? 0);
            $userTrend->push([
                'date' => $dateKey,
                'count' => $count,
            ]);
        }

        // Build a 30-day time log entry trend by created_at
        /** @var Collection<int, array{date: string, count: int}> $timeLogsByDay */
        $timeLogsByDay = TimeLog::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row): array => [
                'date' => (string) $row->date,
                'count' => (int) $row->count,
            ]);

        // Normalize to include days with zero count (time logs)
        $timeLogTrend = collect();
        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $dateKey = $d->toDateString();
            $count = (int) ($timeLogsByDay->firstWhere('date', $dateKey)['count'] ?? 0);
            $timeLogTrend->push([
                'date' => $dateKey,
                'count' => $count,
            ]);
        }

        return Inertia::render('Admin/Dashboard', [
            'userCount' => $userCount,
            'timeLogCount' => $timeLogCount,
            'projectCount' => $projectCount,
            'clientCount' => $clientCount,
            'invoiceCount' => $invoiceCount,
            'tasksCount' => $tasksCount,
            'totalHoursLogged' => $totalHoursLogged,
            'userRegistrationTrend' => $userTrend,
            'timeLogTrend' => $timeLogTrend,
        ]);
    }
}
