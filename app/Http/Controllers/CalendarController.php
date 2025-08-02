<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

final class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $view = $request->query('view', 'month');
        $date = $request->query('date', now()->format('Y-m-d'));

        // Get the start and end dates based on the view
        $period = $this->getPeriod($date, $view);

        // Get time logs for the given period
        $timeLogs = TimeLog::with(['project', 'task'])
            ->where('user_id', auth()->id())
            ->whereBetween('start_timestamp', [$period['start'], $period['end']])
            ->get()
            ->map(fn ($log): array => [
                'id' => $log->id,
                'project' => [
                    'id' => $log->project->id,
                    'name' => $log->project->name,
                    'color' => $log->project->color ?? '#4F46E5',
                ],
                'task' => $log->task ? [
                    'id' => $log->task->id,
                    'title' => $log->task->title,
                ] : null,
                'start' => $log->start_timestamp,
                'end' => $log->end_timestamp,
                'duration' => $log->duration,
                'note' => $log->note,
                'status' => $log->status,
            ]);

        return Inertia::render('calendar/index', [
            'timeLogs' => $timeLogs,
            'view' => $view,
            'date' => $date,
            'period' => $period,
        ]);
    }

    public function detail($id)
    {
        $timeLog = TimeLog::with(['project', 'task', 'user'])
            ->findOrFail($id);

        return response()->json($timeLog);
    }

    private function getPeriod($date, $view): array
    {
        $date = Carbon::parse($date);

        switch ($view) {
            case 'month':
                $start = $date->copy()->startOfMonth();
                $end = $date->copy()->endOfMonth();
                break;
            case 'week':
                $start = $date->copy()->startOfWeek();
                $end = $date->copy()->endOfWeek();
                break;
            case 'day':
            default:
                $start = $date->copy()->startOfDay();
                $end = $date->copy()->endOfDay();
                break;
        }

        return [
            'start' => $start,
            'end' => $end,
        ];
    }
}
