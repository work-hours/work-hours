<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeLogRequest;
use App\Http\Requests\UpdateTimeLogRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Imports\TimeLogImport;
use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use App\Notifications\TimeLogEntry;
use App\Notifications\TimeLogPaid;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Msamgan\Lact\Attributes\Action;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
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

            $data['currency'] = auth()->user()->currency;
            if (! empty($data['project_id'])) {
                $project = Project::query()->find($data['project_id']);
                $data['currency'] = $project ? TimeLogStore::currency(project: $project) : auth()->user()->currency;
            }

            $isLogCompleted = ! empty($data['start_timestamp']) && ! empty($data['end_timestamp']);

            if ($isLogCompleted) {
                $start = Carbon::parse($data['start_timestamp']);
                $end = Carbon::parse($data['end_timestamp']);

                $data['duration'] = round(abs($start->diffInMinutes($end)) / 60, 2);
            }

            $timeLog = TimeLog::query()->create($data);
            DB::commit();

            if ($isLogCompleted) {
                $teamLeader = User::teamLeader(project: $timeLog->project);
                if (auth()->id() !== $teamLeader->getKey()) {
                    $teamLeader->notify(new TimeLogEntry($timeLog, auth()->user()));
                }
            }
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

            $currentUser = auth()->user();
            $projectAmounts = [];
            $invalidLogs = [];

            foreach ($timeLogs as $timeLog) {
                if (empty($timeLog->start_timestamp) || empty($timeLog->end_timestamp)) {
                    $invalidLogs[] = $timeLog->id;

                    continue;
                }

                $hourlyRate = Team::memberHourlyRate(project: $timeLog->project, memberId: $timeLog->user_id);
                $timeLog->update([
                    'is_paid' => true,
                    'hourly_rate' => $hourlyRate,
                ]);

                $amount = $timeLog->duration * $hourlyRate;

                if (! isset($projectAmounts[$timeLog->project_id])) {
                    $projectAmounts[$timeLog->project_id] = 0;
                }

                $projectAmounts[$timeLog->project_id] += $amount;

                // Send notifications
                $teamLeader = User::teamLeader(project: $timeLog->project);
                $timeLogOwner = User::query()->find($timeLog->user_id);

                // If current user is team leader, notify the team member
                if ($currentUser->id === $teamLeader->id && $currentUser->id !== $timeLogOwner->id) {
                    $timeLogOwner->notify(new TimeLogPaid($timeLog, $currentUser));
                }

                // If current user is team member, notify the team leader
                if ($currentUser->id !== $teamLeader->id && $currentUser->id === $timeLogOwner->id) {
                    $teamLeader->notify(new TimeLogPaid($timeLog, $currentUser));
                }
            }

            foreach ($projectAmounts as $projectId => $amount) {
                $project = Project::query()->find($projectId);
                if ($project) {
                    $project->paid_amount += $amount;
                    $project->save();
                }
            }

            DB::commit();

            // If there were any invalid logs, flash a message to the user
            if ($invalidLogs !== []) {
                $count = count($invalidLogs);
                $message = $count === 1
                    ? "1 time log entry was skipped because it doesn't have both start and end timestamps."
                    : "$count time log entries were skipped because they don't have both start and end timestamps.";

                session()->flash('warning', $message);
            }
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

            $data['currency'] = auth()->user()->currency;
            if (! empty($data['project_id'])) {
                $project = Project::query()->find($data['project_id']);
                $data['currency'] = $project ? TimeLogStore::currency(project: $project) : auth()->user()->currency;
            }

            $isLogCompleted = ! empty($data['start_timestamp']) && ! empty($data['end_timestamp']);

            if ($isLogCompleted) {
                $start = Carbon::parse($data['start_timestamp']);
                $end = Carbon::parse($data['end_timestamp']);

                $data['duration'] = round(abs($start->diffInMinutes($end)) / 60, 2);
            }

            $timeLog->update($data);
            DB::commit();

            if ($isLogCompleted) {
                $teamLeader = User::teamLeader(project: $timeLog->project);
                if (auth()->id() !== $teamLeader->getKey()) {
                    $teamLeader->notify(new TimeLogEntry($timeLog));
                }
            }

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

        $mappedTimeLogs = $timeLogs->map(function ($timeLog): array {
            $hourlyRate = $timeLog->hourly_rate
                ?: Team::memberHourlyRate(project: $timeLog->project, memberId: $timeLog->user_id);

            $paidAmount = $timeLog->is_paid ? round($timeLog->duration * $hourlyRate, 2) : 0;

            return [
                'id' => $timeLog->id,
                'project_name' => $timeLog->project ? $timeLog->project->name : 'No Project',
                'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : '',
                'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
                'hourly_rate' => $hourlyRate,
                'paid_amount' => $paidAmount,
                'note' => $timeLog->note,
                'is_paid' => $timeLog->is_paid ? 'Yes' : 'No',
            ];
        });

        $headers = ['ID', 'Project', 'Start Time', 'End Time', 'Duration (hours)', 'Hourly Rate', 'Paid Amount', 'Note', 'Paid'];
        $filename = 'time_logs_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($mappedTimeLogs, $headers, $filename);
    }

    /**
     * Import time logs from Excel
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'time-log.import', middleware: ['auth', 'verified'])]
    public function import(Request $request): JsonResponse
    {
        $request->validate(['file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:2048']]);

        DB::beginTransaction();
        try {
            $import = new TimeLogImport();
            Excel::import($import, $request->file('file'));

            $errors = $import->getErrors();
            $successCount = $import->getSuccessCount();

            if (count($errors) > 0) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'Import failed. No records were imported.',
                    'errors' => $errors,
                ], 422);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $successCount . ' time logs imported successfully.',
                'errors' => $errors,
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate a sample Excel template for time log import
     */
    #[Action(method: 'get', name: 'time-log.template', middleware: ['auth', 'verified'])]
    public function template(): StreamedResponse
    {
        $projects = ProjectStore::userProjects(userId: auth()->id())->pluck('name')->toArray();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $sheet->setCellValue('A1', 'Project');
        $sheet->setCellValue('B1', 'Start Timestamp');
        $sheet->setCellValue('C1', 'End Timestamp');
        $sheet->setCellValue('D1', 'Note');

        for ($row = 2; $row <= 100; $row++) {
            $validation = $sheet->getCell('A' . $row)->getDataValidation();
            $validation->setType(DataValidation::TYPE_LIST);
            $validation->setErrorStyle(DataValidation::STYLE_INFORMATION);
            $validation->setAllowBlank(false);
            $validation->setShowDropDown(true);
            $validation->setFormula1('"' . implode(',', $projects) . '"');
        }

        $sheet->setCellValue('A2', $projects[0] ?? '');
        $sheet->setCellValue('B2', Carbon::now()->format('Y-m-d H:i:s'));
        $sheet->setCellValue('C2', Carbon::now()->addHours(2)->format('Y-m-d H:i:s'));
        $sheet->setCellValue('D2', 'Example note');

        foreach (range('A', 'D') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'time_log_template_' . Carbon::now()->format('Y-m-d') . '.xlsx';

        return response()->streamDownload(function () use ($writer): void {
            $writer->save('php://output');
        }, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
