<?php

declare(strict_types=1);

namespace App\Services;

use App\Adapters\GitHubAdapter;
use App\Adapters\JiraAdapter;
use App\Enums\TimeLogStatus;
use App\Events\TaskCompleted;
use App\Events\TimeLogEntryCreated;
use App\Http\Stores\TimeLogStore;
use App\Models\Project;
use App\Models\Task;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use App\Notifications\TimeLogEntry;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

final readonly class TimeLogService
{
    public function __construct(
        private GitHubAdapter $gitHubAdapter,
        private JiraAdapter $jiraAdapter,
    ) {}

    /**
     * Base query for current authenticated user's time logs.
     */
    public function baseQuery(): Builder
    {
        return TimeLog::query()->where('user_id', auth()->id());
    }

    /**
     * Enriches incoming time log data with computed fields and metadata.
     *
     * @return array{data: array, is_completed: bool, project: (Project|null)}
     */
    public function enrichTimeLogData(array $data): array
    {
        $project = Project::query()->find($data['project_id'] ?? null);

        $data['currency'] = $project ? TimeLogStore::currency(project: $project) : auth()->user()->currency;
        $data['hourly_rate'] = Team::memberHourlyRate(project: $project, memberId: auth()->id());

        $isLogCompleted = ! empty($data['start_timestamp']) && ! empty($data['end_timestamp']);

        if ($isLogCompleted) {
            $start = Carbon::parse($data['start_timestamp']);
            $end = Carbon::parse($data['end_timestamp']);

            if ($start->format('Y-m-d') !== $end->format('Y-m-d')) {
                $end = Carbon::parse($end->format('H:i:s'))->setDateFrom($start);
                $data['end_timestamp'] = $end->toDateTimeString();
            }

            $data['duration'] = round(abs($start->diffInMinutes($end)) / 60, 2);

            if ($project && $project->isCreator(auth()->id())) {
                $data['status'] = TimeLogStatus::APPROVED;
                $data['approved_by'] = auth()->id();
                $data['approved_at'] = Carbon::now();
            }
        }

        return [
            'data' => $data,
            'is_completed' => $isLogCompleted,
            'project' => $project,
        ];
    }

    /**
     * Handle task & integration side effects when a time log is completed.
     */
    public function processTaskSideEffects(
        array $data,
        bool $isCompleted,
        bool $markAsComplete,
        bool $closeGitHubIssue,
        bool $markJiraDone,
        bool $requireCompleteForIntegrations,
    ): void {
        if ($isCompleted && ! empty($data['task_id'])) {
            $task = Task::query()->find($data['task_id']);

            if ($task) {
                if ($markAsComplete) {
                    $task->update(['status' => 'completed']);
                    TaskCompleted::dispatch($task, auth()->user(), $task->project->user);
                }

                $canRunIntegrations = ! $requireCompleteForIntegrations || $markAsComplete;

                if ($canRunIntegrations && $closeGitHubIssue && $task->is_imported && $task->meta && $task->meta->source === 'github' && $task->meta->source_state !== 'closed') {
                    $this->gitHubAdapter->closeGitHubIssue($task);
                }

                if ($canRunIntegrations && $markJiraDone && $task->is_imported && $task->meta && $task->meta->source === 'jira' && mb_strtolower((string) $task->meta->source_state) !== 'done') {
                    $this->jiraAdapter->markIssueDone($task);
                }
            }
        }
    }

    /**
     * Notify team leader when a completed time log is created/updated.
     */
    public function notifyTeamLeaderIfCompleted(TimeLog $timeLog, bool $isCompleted): void
    {
        if ($isCompleted) {
            $teamLeader = User::teamLeader(project: $timeLog->project);
            if (auth()->id() !== $teamLeader->getKey()) {
                $teamLeader->notify(new TimeLogEntry($timeLog, auth()->user()));
                TimeLogEntryCreated::dispatch($timeLog, auth()->user(), $teamLeader);
            }
        }
    }
}
