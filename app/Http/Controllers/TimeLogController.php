<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeLogRequest;
use App\Http\Requests\UpdateTimeLogRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class TimeLogController extends Controller
{
    use ExportableTrait;

    public function index()
    {
        $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('user_id', auth()->id()));
        $mappedTimeLogs = TimeLogStore::timeLogMapper($timeLogs);
        $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
        $unpaidHours = round($mappedTimeLogs->where('is_paid', false)->sum('duration'), 2);
        $team = TeamStore::teamEntry(userId: auth()->id(), memberId: auth()->id());
        $unpaidAmount = TimeLogStore::unpaidAmountFromLogs(timeLogs: $timeLogs);
        $currency = $team instanceof Team ? $team->currency : 'USD';
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;
        $projects = ProjectStore::userProjects(userId: auth()->id());

        return Inertia::render('time-log/index', [
            'timeLogs' => $mappedTimeLogs,
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

            if (! empty($data['start_timestamp']) && ! empty($data['end_timestamp'])) {
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
        $projects = ProjectStore::userProjects(userId: auth()->id());

        return Inertia::render('time-log/create', [
            'projects' => $projects,
        ]);
    }

    public function edit(TimeLog $timeLog)
    {
        Gate::authorize('update', $timeLog);

        $projects = ProjectStore::userProjects(userId: auth()->id());

        return Inertia::render('time-log/edit', [
            'timeLog' => [
                'id' => $timeLog->id,
                'project_id' => $timeLog->project_id,
                'start_timestamp' => $timeLog->start_timestamp,
                'end_timestamp' => $timeLog->end_timestamp,
                'duration' => $timeLog->duration,
                'note' => $timeLog->note,
            ],
            'projects' => $projects,
        ]);
    }

    /**
     * Delete the specified time log.
     *
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'time-log.destroy', params: ['timeLog'], middleware: ['auth', 'verified'])]
    public function destroy(TimeLog $timeLog): void
    {
        Gate::authorize('delete', $timeLog);

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

        abort_if(empty($timeLogIds), 400, 'No time logs selected.');

        DB::beginTransaction();
        try {
            $timeLogs = TimeLog::query()
                ->whereIn('id', $timeLogIds)
                ->get();

            $projectAmounts = [];
            foreach ($timeLogs as $timeLog) {
                $timeLog->update(['is_paid' => true]);

                $hourlyRate = Team::memberHourlyRate(project: $timeLog->project, memberId: $timeLog->user_id);
                $amount = $timeLog->duration * $hourlyRate;

                if (! isset($projectAmounts[$timeLog->project_id])) {
                    $projectAmounts[$timeLog->project_id] = 0;
                }

                $projectAmounts[$timeLog->project_id] += $amount;
            }

            foreach ($projectAmounts as $projectId => $amount) {
                $project = Project::query()->find($projectId);
                if ($project) {
                    $project->paid_amount += $amount;
                    $project->save();
                }
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'time-log.update', params: ['timeLog'], middleware: ['auth', 'verified'])]
    public function update(UpdateTimeLogRequest $request, TimeLog $timeLog): void
    {
        Gate::authorize('update', $timeLog);

        DB::beginTransaction();
        try {
            $data = $request->validated();

            if (! empty($data['start_timestamp']) && ! empty($data['end_timestamp'])) {
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
     * Export time logs to CSV
     */
    #[Action(method: 'get', name: 'time-log.export', middleware: ['auth', 'verified'])]
    public function export(): StreamedResponse
    {
        $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('user_id', auth()->id()));

        $mappedTimeLogs = $timeLogs->map(fn ($timeLog): array => [
            'id' => $timeLog->id,
            'project_name' => $timeLog->project ? $timeLog->project->name : 'No Project',
            'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
            'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : '',
            'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
            'note' => $timeLog->note,
            'is_paid' => $timeLog->is_paid ? 'Yes' : 'No',
        ]);

        $headers = ['ID', 'Project', 'Start Time', 'End Time', 'Duration (hours)', 'Note', 'Paid'];
        $filename = 'time_logs_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($mappedTimeLogs, $headers, $filename);
    }
}
