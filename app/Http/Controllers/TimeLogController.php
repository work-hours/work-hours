<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeLogRequest;
use App\Http\Requests\UpdateTimeLogRequest;
use App\Models\TimeLog;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Throwable;

class TimeLogController extends Controller
{
    public function index()
    {
        $query = TimeLog::query()->where('user_id', auth()->id());

        // Apply date filters if provided
        if (request()->has('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->has('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        $timeLogs = $query->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                    'duration' => round($timeLog->duration, 2),
                ];
            });

        // Calculate total hours
        $totalDuration = round($timeLogs->sum('duration'), 2);

        // Calculate weekly average
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        return Inertia::render('time-log/index', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
            ],
            'totalDuration' => $totalDuration,
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
        return Inertia::render('time-log/create');
    }

    public function edit(TimeLog $timeLog)
    {
        // Check if the time log belongs to the authenticated user
        if ($timeLog->user_id !== auth()->id()) {
            abort(403, 'You can only edit your own time logs.');
        }

        return Inertia::render('time-log/edit', [
            'timeLog' => $timeLog,
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
}
