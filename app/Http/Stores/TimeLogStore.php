<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Enums\TimeLogStatus;
use App\Http\QueryFilters\TimeLog\EndDateFilter;
use App\Http\QueryFilters\TimeLog\IsPaidFilter;
use App\Http\QueryFilters\TimeLog\ProjectIdFilter;
use App\Http\QueryFilters\TimeLog\StartDateFilter;
use App\Http\QueryFilters\TimeLog\StatusFilter;
use App\Http\QueryFilters\TimeLog\TagFilter;
use App\Http\QueryFilters\TimeLog\UserIdFilter;
use App\Models\Client;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pipeline\Pipeline;

final class TimeLogStore
{
    public static function dailyTrend(array $teamMembersIds, int $userId, int $days = 7, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        if ($startDate instanceof Carbon || $endDate instanceof Carbon) {
            $startDate = ($startDate ?? Carbon::today())->copy()->startOfDay();
            $endDate = ($endDate ?? Carbon::today())->copy()->endOfDay();

            if ($endDate->lt($startDate)) {
                [$startDate, $endDate] = [$endDate, $startDate];
            }
        } else {
            $days = max(1, $days);
            $startDate = Carbon::today()->subDays($days - 1)->startOfDay();
            $endDate = Carbon::today()->endOfDay();
        }
        $logs = TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->where('status', TimeLogStatus::APPROVED)
            ->whereBetween('start_timestamp', [$startDate, $endDate])
            ->get(['user_id', 'start_timestamp', 'duration']);

        $groupedByDate = $logs->groupBy(fn (TimeLog $log): string => $log->start_timestamp->toDateString());
        $totalDays = $startDate->copy()->startOfDay()->diffInDays($endDate->copy()->startOfDay()) + 1;

        $result = [];
        for ($i = 0; $i < $totalDays; $i++) {
            $date = $startDate->copy()->addDays($i)->toDateString();
            $dayLogs = $groupedByDate->get($date, collect());

            $teamHours = round((float) $dayLogs->sum('duration'), 2);
            $userHours = round((float) $dayLogs->where('user_id', $userId)->sum('duration'), 2);

            $result[] = [
                'date' => $date,
                'userHours' => $userHours,
                'teamHours' => $teamHours,
            ];
        }

        return $result;
    }

    public static function recentTeamLogs(array $teamMembersIds, int $limit = 5): Collection
    {
        return TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->where('status', TimeLogStatus::APPROVED)
            ->orderBy('start_timestamp', 'desc')
            ->with('user')
            ->take($limit)
            ->get(['start_timestamp', 'end_timestamp', 'duration', 'user_id']);
    }

    public static function timeLogs(Builder $baseQuery)
    {
        return app(Pipeline::class)
            ->send($baseQuery)
            ->through([
                StartDateFilter::class,
                EndDateFilter::class,
                UserIdFilter::class,
                IsPaidFilter::class,
                ProjectIdFilter::class,
                StatusFilter::class,
                TagFilter::class,
            ])
            ->thenReturn()
            ->with(['user', 'project', 'task', 'tags'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public static function totalHours(array $teamMembersIds): float
    {
        return TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->where('status', TimeLogStatus::APPROVED)
            ->sum('duration');
    }

    public static function unbillableHours(array $teamMembersIds): float
    {
        return TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->where('status', TimeLogStatus::APPROVED)
            ->where('non_billable', true)
            ->sum('duration');
    }

    public static function unpaidHours(array $teamMembersIds)
    {
        return TimeLog::query()
            ->whereIn('user_id', $teamMembersIds)
            ->where('is_paid', false)
            ->where('non_billable', false)
            ->where('status', TimeLogStatus::APPROVED)
            ->sum('duration');
    }

    public static function unpaidAmount(array $teamMembersIds): array
    {
        $unpaidAmounts = [];
        foreach ($teamMembersIds as $memberId) {
            $unpaidLogs = self::unpaidTimeLog(teamMemberId: $memberId)->where('non_billable', false);
            $unpaidLogs->each(function ($log) use (&$unpaidAmounts, $memberId): void {
                $memberUnpaidHours = $log->duration;
                $hourlyRate = Team::memberHourlyRate(project: $log->project, memberId: $memberId);
                $currency = $log->currency ?? 'USD';

                if ($hourlyRate) {
                    if (! isset($unpaidAmounts[$currency])) {
                        $unpaidAmounts[$currency] = 0;
                    }
                    $unpaidAmounts[$currency] += $memberUnpaidHours * $hourlyRate;
                }
            });
        }

        foreach ($unpaidAmounts as $currency => $amount) {
            $unpaidAmounts[$currency] = round($amount, 2);
        }

        return $unpaidAmounts;
    }

    public static function unpaidTimeLog(int $teamMemberId): Collection
    {
        return TimeLog::query()
            ->with('project')
            ->where('user_id', $teamMemberId)
            ->where('is_paid', false)
            ->where('non_billable', false)
            ->where('status', TimeLogStatus::APPROVED)
            ->get();
    }

    public static function unpaidTimeLogs(int $teamMemberId): Collection
    {

        return self::unpaidTimeLog($teamMemberId);
    }

    public static function unpaidTimeLogsByClient(int $clientId): Collection
    {

        $client = Client::query()->findOrFail($clientId);

        $projects = ClientStore::clientProjects($client);

        $timeLogs = new Collection();
        foreach ($projects as $project) {
            $projectTimeLogs = TimeLog::query()
                ->with('project')
                ->where('project_id', $project->id)
                ->whereNull('invoice_id')
                ->where('is_paid', false)
                ->where('non_billable', false)
                ->where('status', TimeLogStatus::APPROVED)
                ->get();

            $timeLogs = $timeLogs->concat($projectTimeLogs);
        }

        return $timeLogs;
    }

    public static function unpaidTimeLogsGroupedByProject(int $clientId): array
    {

        $timeLogs = self::unpaidTimeLogsByClient($clientId);

        $client = Client::query()->find($clientId);

        $groupedTimeLogs = [];

        foreach ($timeLogs as $timeLog) {
            $projectId = $timeLog->project_id;
            $projectName = $timeLog->project->name;

            if (! isset($groupedTimeLogs[$projectId])) {

                $hourlyRate = ($client && $client->hourly_rate) ? $client->hourly_rate : (auth()->user()->hourly_rate ?? 0);
                $currency = ($client && $client->currency) ? $client->currency : (auth()->user()->currency ?? 'USD');

                $groupedTimeLogs[$projectId] = [
                    'project_id' => $projectId,
                    'project_name' => $projectName,
                    'total_hours' => 0,
                    'hourly_rate' => $hourlyRate,
                    'currency' => $currency,
                    'time_logs' => [],
                ];
            }

            $groupedTimeLogs[$projectId]['time_logs'][] = $timeLog;

            if (! $timeLog->non_billable) {
                $groupedTimeLogs[$projectId]['total_hours'] += $timeLog->duration;
            }
        }

        return array_values($groupedTimeLogs);
    }

    public static function paidAmount(array $teamMembersIds): array
    {
        $paidAmounts = [];
        foreach ($teamMembersIds as $memberId) {
            $paidLogs = self::paidTimeLog(teamMemberId: $memberId);
            $paidLogs->each(function ($log) use (&$paidAmounts, $memberId): void {
                $memberPaidHours = $log->duration;
                $hourlyRate = Team::memberHourlyRate(project: $log->project, memberId: $memberId);
                $currency = $log->currency ?? 'USD';

                if ($hourlyRate) {
                    if (! isset($paidAmounts[$currency])) {
                        $paidAmounts[$currency] = 0;
                    }
                    $paidAmounts[$currency] += $memberPaidHours * $hourlyRate;
                }
            });
        }

        foreach ($paidAmounts as $currency => $amount) {
            $paidAmounts[$currency] = round($amount, 2);
        }

        return $paidAmounts;
    }

    public static function paidTimeLog(int $teamMemberId): Collection
    {
        return TimeLog::query()
            ->with('project')
            ->where('user_id', $teamMemberId)
            ->where('is_paid', true)
            ->where('status', TimeLogStatus::APPROVED)
            ->get();
    }

    public static function currency(Project $project)
    {
        $team = TeamStore::teamEntry(userId: $project->user_id, memberId: auth()->id());

        return $team instanceof Team ? $team->currency : auth()->user()->currency;
    }

    public static function resData(\Illuminate\Support\Collection|LengthAwarePaginator $timeLogs, ?\Illuminate\Support\Collection $fullTimeLogsForStats = null): array
    {
        $displayLogs = $timeLogs instanceof LengthAwarePaginator
            ? collect($timeLogs->items())
            : $timeLogs;

        $statsCollection = $fullTimeLogsForStats instanceof \Illuminate\Support\Collection
            ? $fullTimeLogsForStats
            : $displayLogs;

        $timeLogStats = self::stats($statsCollection);
        $tags = Tag::query()->where('user_id', auth()->id())->get(['id', 'name']);

        $response = [
            'timeLogs' => self::timeLogMapper($displayLogs),
            'filters' => self::filters(),
            'projects' => ProjectStore::userProjects(userId: auth()->id()),
            'totalDuration' => $timeLogStats['total_duration'],
            'unpaidHours' => $timeLogStats['unpaid_hours'],
            'paidHours' => $timeLogStats['paid_hours'],
            'unbillableHours' => $timeLogStats['unbillable_hours'] ?? 0,
            'weeklyAverage' => $timeLogStats['weekly_average'],
            'unpaidAmountsByCurrency' => $timeLogStats['unpaid_amounts_by_currency'],
            'paidAmountsByCurrency' => $timeLogStats['paid_amounts_by_currency'],
            'tags' => $tags,
        ];

        if ($timeLogs instanceof LengthAwarePaginator) {
            $array = $timeLogs->toArray();
            $response['links'] = $array['links'] ?? [];
        }

        return $response;
    }

    public static function stats(\Illuminate\Support\Collection $timeLogs): array
    {
        $approvedLogs = $timeLogs->where('status', TimeLogStatus::APPROVED);
        $totalDuration = round($approvedLogs->sum('duration'), 2);

        return [
            'total_duration' => $totalDuration,
            'unpaid_hours' => round($approvedLogs->where('is_paid', false)->where('non_billable', false)->sum('duration'), 2),
            'paid_hours' => round($approvedLogs->where('is_paid', true)->sum('duration'), 2),
            'unbillable_hours' => round($approvedLogs->where('non_billable', true)->sum('duration'), 2),
            'weekly_average' => $totalDuration > 0 ? round($totalDuration / 7, 2) : 0,
            'unpaid_amounts_by_currency' => self::unpaidAmountFromLogs($approvedLogs),
            'paid_amounts_by_currency' => self::paidAmountFromLogs($approvedLogs),
        ];
    }

    public static function unpaidAmountFromLogs(\Illuminate\Support\Collection $timeLogs): array
    {
        $unpaidAmounts = [];

        $timeLogs->each(function (TimeLog $timeLog) use (&$unpaidAmounts): void {
            $hourlyRate = Team::memberHourlyRate(project: $timeLog->project, memberId: $timeLog->user_id);
            $currency = $timeLog->currency ?? 'USD';

            if (! $timeLog['is_paid'] && $timeLog['status'] === TimeLogStatus::APPROVED && ! $timeLog['non_billable']) {
                if (! isset($unpaidAmounts[$currency])) {
                    $unpaidAmounts[$currency] = 0;
                }
                $unpaidAmounts[$currency] += $timeLog['duration'] * $hourlyRate;
            }
        });

        foreach ($unpaidAmounts as $currency => $amount) {
            $unpaidAmounts[$currency] = round($amount, 2);
        }

        return $unpaidAmounts;
    }

    public static function paidAmountFromLogs(\Illuminate\Support\Collection $timeLogs): array
    {
        $paidAmounts = [];

        $timeLogs->each(function (TimeLog $timeLog) use (&$paidAmounts): void {
            $hourlyRate = Team::memberHourlyRate(project: $timeLog->project, memberId: $timeLog->user_id);
            $currency = $timeLog->currency ?? 'USD';

            if ($timeLog['is_paid'] && $timeLog['status'] === TimeLogStatus::APPROVED) {
                if (! isset($paidAmounts[$currency])) {
                    $paidAmounts[$currency] = 0;
                }
                $paidAmounts[$currency] += $timeLog['duration'] * $hourlyRate;
            }
        });

        foreach ($paidAmounts as $currency => $amount) {
            $paidAmounts[$currency] = round($amount, 2);
        }

        return $paidAmounts;
    }

    public static function timeLogMapper(\Illuminate\Support\Collection $timeLogs): \Illuminate\Support\Collection
    {
        return $timeLogs->map(function ($timeLog): array {
            $hourlyRate = (float) $timeLog->hourly_rate ?? Team::memberHourlyRate(project: $timeLog->project, memberId: $timeLog->user_id);
            $paidAmount = $timeLog->is_paid ? round($timeLog->duration * $hourlyRate, 2) : 0;

            $approverName = null;
            if ($timeLog->approved_by) {
                $approver = User::query()->find($timeLog->approved_by);
                $approverName = $approver ? $approver->name : null;
            }

            $isNonMonetary = Team::isMemberNonMonetary(userId: $timeLog->project->user_id, memberId: $timeLog->user_id);

            return [
                'id' => $timeLog->id,
                'user_id' => $timeLog->user_id,
                'user_name' => $timeLog->user ? $timeLog->user->name : null,
                'project_id' => $timeLog->project_id,
                'project_name' => $timeLog->project ? $timeLog->project->name : 'No Project',
                'task_id' => $timeLog->task_id,
                'task_title' => $timeLog->task ? $timeLog->task->title : null,
                'task_description' => $timeLog->task ? $timeLog->task->description : null,
                'task_status' => $timeLog->task ? $timeLog->task->status : null,
                'task_priority' => $timeLog->task ? $timeLog->task->priority : null,
                'task_due_date' => $timeLog->task && $timeLog->task->due_date ? Carbon::parse($timeLog->task->due_date)->toDateString() : null,
                'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
                'note' => $timeLog->note,
                'is_paid' => $timeLog->is_paid,
                'hourly_rate' => $hourlyRate,
                'paid_amount' => $paidAmount,
                'currency' => $timeLog->currency ?? 'USD',
                'status' => $timeLog->status,
                'approved_by' => $timeLog->approved_by,
                'approver_name' => $approverName,
                'comment' => $timeLog->comment,
                'user_non_monetary' => $isNonMonetary,
                'non_billable' => (bool) ($timeLog->non_billable ?? false),
                'tags' => $timeLog->tags ? $timeLog->tags->map(fn ($tag): array => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'color' => $tag->color ?? '#032C95', // Default to blue if no color is set
                ]) : [],
            ];
        });
    }

    public static function timeLogExportMapper(\Illuminate\Support\Collection $timeLogs): \Illuminate\Support\Collection
    {
        $map = self::timeLogMapper($timeLogs);

        return $map->map(fn ($timeLog): array => [
            $timeLog['user_name'],
            $timeLog['project_name'],
            $timeLog['task_title'] ?? 'No Task',
            $timeLog['task_status'] ?? '',
            $timeLog['task_priority'] ?? '',
            $timeLog['task_due_date'] ?? '',
            $timeLog['start_timestamp'],
            $timeLog['end_timestamp'],
            $timeLog['duration'],
            $timeLog['note'],
            $timeLog['is_paid'] ? 'Yes' : 'No',
            $timeLog['hourly_rate'],
            $timeLog['paid_amount'],
            $timeLog['currency'],
            $timeLog['status']?->value,
            $timeLog['approver_name'] ?? '',
            $timeLog['comment'] ?? '',
        ]);
    }

    public static function timeLogExportHeaders(): array
    {
        return [
            'User Name',
            'Project Name',
            'Task Title',
            'Task Status',
            'Task Priority',
            'Task Due Date',
            'Start Timestamp',
            'End Timestamp',
            'Duration (hours)',
            'Note',
            'Is Paid',
            'Hourly Rate',
            'Paid Amount',
            'Currency',
            'Status',
            'Approver Name',
            'Comment',
        ];
    }

    public static function filters(): array
    {
        return [
            'start-date' => request('start-date', ''),
            'end-date' => request('end-date', ''),
            'user' => (string) request('user', ''),
            'project' => (string) request('project', ''),
            'is-paid' => (string) request('is-paid', ''),
            'status' => (string) request('status', ''),
            'tag' => (string) request('tag', ''),
        ];
    }
}
