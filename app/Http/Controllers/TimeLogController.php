<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeLogRequest;
use App\Http\Requests\UpdateTimeLogRequest;
use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Msamgan\Lact\Attributes\Action;
use Throwable;

class TimeLogController extends Controller
{
    use ExportableTrait;
    public function index()
    {
        $query = TimeLog::query()->where('user_id', auth()->id());

        // Apply date filters if provided
        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        // Apply project filter if provided
        if (request()->get('project_id') && request('project_id')) {
            // Validate that the project belongs to the logged-in user
            $userProjects = $this->getUserProjects()->pluck('id')->toArray();
            if (in_array(request('project_id'), $userProjects)) {
                $query->where('project_id', request('project_id'));
            }
        }

        // Apply paid/unpaid filter if provided
        if (request()->get('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with('project')->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'project_id' => $timeLog->project_id,
                    'project_name' => $timeLog->project ? $timeLog->project->name : null,
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                    'duration' => round($timeLog->duration, 2),
                    'is_paid' => $timeLog->is_paid,
                ];
            });

        // Calculate total hours
        $totalDuration = round($timeLogs->sum('duration'), 2);

        // Calculate unpaid hours
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);

        // Get the user's hourly rate and currency from their team information
        $team = Team::query()
            ->where('member_id', auth()->id())
            ->first();

        // Calculate unpaid amount
        $hourlyRate = $team ? $team->hourly_rate : 0;
        $unpaidAmount = round($unpaidHours * $hourlyRate, 2);
        $currency = $team ? $team->currency : 'USD';

        // Calculate weekly average
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        // Get projects for the dropdown
        $projects = $this->getUserProjects();

        return Inertia::render('time-log/index', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
                'project_id' => request('project_id', ''),
                'is_paid' => request('is_paid', ''),
            ],
            'projects' => $projects,
            'totalDuration' => $totalDuration,
            'unpaidHours' => $unpaidHours,
            'unpaidAmount' => $unpaidAmount,
            'currency' => $currency,
            'weeklyAverage' => $weeklyAverage,
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'time-log.store', middleware: ['auth', 'verified'])]
    public function store(StoreTimeLogRequest $request): void
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $data['user_id'] = auth()->id();

            // Calculate duration in minutes
            if (!empty($data['start_timestamp']) && !empty($data['end_timestamp'])) {
                $start = Carbon::parse($data['start_timestamp']);
                $end = Carbon::parse($data['end_timestamp']);

                $data['duration'] = round(abs($start->diffInMinutes($end)) / 60, 2);
            }

            TimeLog::query()->create($data);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function create()
    {
        $projects = $this->getUserProjects();

        return Inertia::render('time-log/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Get projects created by or assigned to the current user
     */
    private function getUserProjects()
    {
        $userId = auth()->id();

        return Project::query()->where('user_id', $userId)
            ->orWhereHas('teamMembers', function ($query) use ($userId) {
                $query->where('member_id', $userId);
            })
            ->get(['id', 'name']);
    }

    public function edit(TimeLog $timeLog)
    {
        // Check if the time log belongs to the authenticated user
        if ($timeLog->user_id !== auth()->id()) {
            abort(403, 'You can only edit your own time logs.');
        }

        $projects = $this->getUserProjects();

        return Inertia::render('time-log/edit', [
            'timeLog' => [
                'id' => $timeLog->id,
                'project_id' => $timeLog->project_id,
                'start_timestamp' => $timeLog->start_timestamp,
                'end_timestamp' => $timeLog->end_timestamp,
                'duration' => $timeLog->duration,
            ],
            'projects' => $projects,
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'time-log.update', params: ['timeLog'], middleware: ['auth', 'verified'])]
    public function update(UpdateTimeLogRequest $request, TimeLog $timeLog): void
    {
        // Check if the time log belongs to the authenticated user
        if ($timeLog->user_id !== auth()->id()) {
            abort(403, 'You can only update your own time logs.');
        }

        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Calculate duration in minutes
            if (!empty($data['start_timestamp']) && !empty($data['end_timestamp'])) {
                $start = Carbon::parse($data['start_timestamp']);
                $end = Carbon::parse($data['end_timestamp']);

                $data['duration'] = round(abs($start->diffInMinutes($end)) / 60, 2);
            }

            $timeLog->update($data);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete the specified time log.
     *
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'time-log.destroy', params: ['timeLog'], middleware: ['auth', 'verified'])]
    public function destroy(TimeLog $timeLog): void
    {
        // Check if the time log belongs to the authenticated user
        if ($timeLog->user_id !== auth()->id()) {
            abort(403, 'You can only delete your own time logs.');
        }

        DB::beginTransaction();
        try {
            $timeLog->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Mark selected time logs as paid
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'time-log.mark-as-paid', middleware: ['auth', 'verified'])]
    public function markAsPaid(): void
    {
        $timeLogIds = request('time_log_ids', []);

        if (empty($timeLogIds)) {
            abort(400, 'No time logs selected.');
        }

        DB::beginTransaction();
        try {
            // Ensure the time logs belong to the authenticated user
            $timeLogs = TimeLog::query()
                ->whereIn('id', $timeLogIds)
                ->get();

            foreach ($timeLogs as $timeLog) {
                $timeLog->update(['is_paid' => true]);
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Export time logs to CSV
     *
     * @return StreamedResponse
     */
    #[Action(method: 'get', name: 'time-log.export', middleware: ['auth', 'verified'])]
    public function export(): StreamedResponse
    {
        $query = TimeLog::query()->where('user_id', auth()->id());

        // Apply date filters if provided
        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        // Apply project filter if provided
        if (request()->get('project_id') && request('project_id')) {
            // Validate that the project belongs to the logged-in user
            $userProjects = $this->getUserProjects()->pluck('id')->toArray();
            if (in_array(request('project_id'), $userProjects)) {
                $query->where('project_id', request('project_id'));
            }
        }

        // Apply paid/unpaid filter if provided
        if (request()->has('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with('project')->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'project_name' => $timeLog->project ? $timeLog->project->name : 'No Project',
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : '',
                    'duration' => round($timeLog->duration, 2),
                    'is_paid' => $timeLog->is_paid,
                ];
            });

        $headers = ['ID', 'Project', 'Start Time', 'End Time', 'Duration (hours)', 'Paid'];
        $filename = 'time_logs_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($timeLogs, $headers, $filename);
    }
}
