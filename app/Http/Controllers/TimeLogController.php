<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\TimeLogStatus;
use App\Http\Requests\StoreTimeLogRequest;
use App\Http\Requests\UpdateTimeLogRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TaskStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Imports\TimeLogImport;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use App\Notifications\TimeLogPaid;
use App\Services\ApprovalService;
use App\Services\TimeLogService;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Log;
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

    public function __construct(private readonly TimeLogService $timeLogService, private readonly ApprovalService $approvalService) {}

    public function index()
    {
        $timeLogs = TimeLogStore::timeLogs(baseQuery: $this->timeLogService->baseQuery());

        return Inertia::render('time-log/index', TimeLogStore::resData(timeLogs: $timeLogs));
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

            $enriched = $this->timeLogService->enrichTimeLogData($data);
            $data = $enriched['data'];
            $isLogCompleted = $enriched['is_completed'];

            $markAsComplete = $data['mark_task_complete'] ?? false;
            $closeGitHubIssue = $data['close_github_issue'] ?? false;
            $markJiraDone = $data['mark_jira_done'] ?? false;

            unset($data['mark_task_complete'], $data['close_github_issue'], $data['mark_jira_done'], $data['tags']);

            $timeLog = TimeLog::query()->create($data);

            $this->attachTags($request, $timeLog);

            $this->timeLogService->processTaskSideEffects(
                data: ['task_id' => $data['task_id'] ?? null],
                isCompleted: $isLogCompleted,
                markAsComplete: $markAsComplete,
                closeGitHubIssue: $closeGitHubIssue,
                markJiraDone: $markJiraDone,
                requireCompleteForIntegrations: false,
            );

            DB::commit();

            $this->timeLogService->notifyTeamLeaderIfCompleted($timeLog, $isLogCompleted);
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function create()
    {
        $projects = ProjectStore::userProjects(userId: auth()->id());

        $tasks = TaskStore::assignedTasks(userId: auth()->id());

        return Inertia::render('time-log/create', [
            'projects' => $projects,
            'tasks' => $tasks,
        ]);
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

            $enriched = $this->timeLogService->enrichTimeLogData($data);
            $data = $enriched['data'];
            $isLogCompleted = $enriched['is_completed'];

            $markAsComplete = $data['mark_task_complete'] ?? false;
            $closeGitHubIssue = $data['close_github_issue'] ?? false;
            $markJiraDone = $data['mark_jira_done'] ?? false;

            unset($data['mark_task_complete'], $data['close_github_issue'], $data['mark_jira_done'], $data['tags']);

            $timeLog->update($data);

            $this->attachTags($request, $timeLog);

            $this->timeLogService->processTaskSideEffects(
                data: ['task_id' => $data['task_id'] ?? null],
                isCompleted: $isLogCompleted,
                markAsComplete: $markAsComplete,
                closeGitHubIssue: $closeGitHubIssue,
                markJiraDone: $markJiraDone,
                requireCompleteForIntegrations: true,
            );

            DB::commit();

            $this->timeLogService->notifyTeamLeaderIfCompleted($timeLog, $isLogCompleted);

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function edit(TimeLog $timeLog)
    {
        Gate::authorize('update', $timeLog);

        $projects = ProjectStore::userProjects(userId: auth()->id());

        $tasks = TaskStore::assignedTasks(userId: auth()->id());

        $timeLog->load('tags');

        return Inertia::render('time-log/edit', [
            'timeLog' => [
                'id' => $timeLog->id,
                'project_id' => $timeLog->project_id,
                'task_id' => $timeLog->task_id,
                'start_timestamp' => $timeLog->start_timestamp,
                'end_timestamp' => $timeLog->end_timestamp,
                'duration' => $timeLog->duration,
                'note' => $timeLog->note,
                'non_billable' => (bool) $timeLog->non_billable,
                'tags' => $timeLog->tags->pluck('name'),
            ],
            'projects' => $projects,
            'tasks' => $tasks,
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

    public function approvals()
    {
        $pendingTimeLogs = $this->approvalService->getPendingApprovals();
        $mappedTimeLogs = TimeLogStore::timeLogMapper($pendingTimeLogs);
        $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
        $projects = ProjectStore::userProjects(userId: auth()->id());

        $teamMembers = TeamStore::teamMembers(userId: auth()->id());

        return Inertia::render('time-log/approvals', [
            'timeLogs' => $mappedTimeLogs,
            'filters' => TimeLogStore::filters(),
            'projects' => $projects,
            'teamMembers' => $teamMembers,
            'totalDuration' => $totalDuration,
        ]);
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

                if ($timeLog->status !== TimeLogStatus::APPROVED) {
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

                $teamLeader = User::teamLeader(project: $timeLog->project);
                $timeLogOwner = User::query()->find($timeLog->user_id);

                if ($currentUser->id === $teamLeader->id && $currentUser->id !== $timeLogOwner->id) {
                    $timeLogOwner->notify(new TimeLogPaid($timeLog, $currentUser));
                    \App\Events\TimeLogPaid::dispatch($timeLog, $currentUser, $timeLogOwner);
                }

                if ($currentUser->id !== $teamLeader->id && $currentUser->id === $timeLogOwner->id) {
                    $teamLeader->notify(new TimeLogPaid($timeLog, $currentUser));
                    \App\Events\TimeLogPaid::dispatch($timeLog, $currentUser, $teamLeader);
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

            if ($invalidLogs !== []) {
                $count = count($invalidLogs);
                $message = $count === 1
                    ? "1 time log entry was skipped because it doesn't have both start and end timestamps or is not approved."
                    : "$count time log entries were skipped because they don't have both start and end timestamps or are not approved.";

                session()->flash('warning', $message);
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
        $timeLogs = TimeLogStore::timeLogs(baseQuery: $this->timeLogService->baseQuery());
        $mappedTimeLogs = TimeLogStore::timeLogExportMapper(timeLogs: $timeLogs);
        $headers = TimeLogStore::timeLogExportHeaders();
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

    /**
     * Attach tags to a time log
     */
    public function attachTags(Request $request, TimeLog $timeLog): JsonResponse
    {
        $tags = $request->input('tags', []);
        $tagIds = [];

        foreach ($tags as $tagName) {
            $tag = Tag::query()->firstOrCreate([
                'name' => $tagName,
                'user_id' => $request->user()->id,
            ]);

            $tagIds[] = $tag->id;
        }

        $timeLog->tags()->sync($tagIds);

        return response()->json([
            'success' => true,
            'tags' => $timeLog->tags,
        ]);
    }

    /**
     * Get tags for a time log
     */
    public function getTags(TimeLog $timeLog): JsonResponse
    {
        return response()->json($timeLog->tags);
    }
}
