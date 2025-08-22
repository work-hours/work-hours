<?php

declare(strict_types=1);

namespace App\Services;

use App\Enums\TimeLogStatus;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TimeLogStore;
use App\Models\TimeLog;
use App\Models\User;
use App\Notifications\TimeLogApproved;
use App\Notifications\TimeLogRejected;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

final class ApprovalService
{
    /**
     * Get all pending time logs for team members where the current user is a team leader or approver.
     */
    public function getPendingApprovals(): Collection
    {
        $leadProjects = ProjectStore::userProjects(userId: auth()->id())
            ->pluck('id')
            ->toArray();

        $approverProjects = DB::table('project_team')
            ->where('member_id', auth()->id())
            ->where('is_approver', true)
            ->pluck('project_id')
            ->toArray();

        $allProjects = array_unique(array_merge($leadProjects, $approverProjects));

        $teamMemberIds = DB::table('project_team')
            ->whereIn('project_id', $allProjects)
            ->where('member_id', '!=', auth()->id())
            ->pluck('member_id')
            ->toArray();

        return TimeLogStore::timeLogs(
            baseQuery: TimeLog::query()
                ->whereIn('user_id', $teamMemberIds)
                ->whereIn('project_id', $allProjects)
                ->where('status', 'pending')
        );
    }

    /**
     * Process a single time log by setting status, saving meta, and notifying relevant users.
     *
     * @throws Exception|Throwable
     */
    public function processTimeLog(TimeLog $timeLog, TimeLogStatus $status, ?string $comment): void
    {
        $this->authorizeApproval($timeLog);

        $timeLog->update([
            'status' => $status,
            'approved_by' => auth()->id(),
            'approved_at' => Carbon::now(),
            'comment' => $comment,
        ]);

        $timeLogOwner = User::query()->find($timeLog->user_id);
        if ($timeLogOwner && auth()->id() !== $timeLogOwner->getKey()) {
            if ($status === TimeLogStatus::APPROVED) {
                $timeLogOwner->notify(new TimeLogApproved($timeLog, auth()->user()));
                \App\Events\TimeLogApproved::dispatch($timeLog, auth()->user(), $timeLogOwner);
            } elseif ($status === TimeLogStatus::REJECTED) {
                $timeLogOwner->notify(new TimeLogRejected($timeLog, auth()->user()));
                \App\Events\TimeLogRejected::dispatch($timeLog, auth()->user(), $timeLogOwner);
            }
        }

        if ($status === TimeLogStatus::REJECTED) {
            $teamLeader = User::teamLeader(project: $timeLog->project);
            $isApprover = DB::table('project_team')
                ->where('project_id', $timeLog->project_id)
                ->where('member_id', auth()->id())
                ->where('is_approver', true)
                ->exists();

            if ($isApprover && auth()->id() !== $teamLeader->getKey()) {
                $teamLeader->notify(new TimeLogRejected($timeLog, auth()->user()));
            }
        }
    }

    /**
     * Process multiple time logs and return the counts [processed, skipped].
     *
     * @return array{0:int,1:int}
     */
    public function processMultipleTimeLogs(array $timeLogIds, TimeLogStatus $status, ?string $comment): array
    {
        $timeLogs = TimeLog::query()
            ->whereIn('id', $timeLogIds)
            ->get();

        $processed = 0;
        $skipped = 0;

        foreach ($timeLogs as $timeLog) {
            try {
                $this->processTimeLog($timeLog, $status, $comment);
                $processed++;
            } catch (Exception) {
                $skipped++;
            } catch (Throwable $e) {
                //
            }
        }

        return [$processed, $skipped];
    }

    /**
     * Check if the current user is authorized to approve/reject the given time log
     *
     * @throws Exception|Throwable
     */
    public function authorizeApproval(TimeLog $timeLog): void
    {
        $teamLeader = User::teamLeader(project: $timeLog->project);

        $isApprover = DB::table('project_team')
            ->where('project_id', $timeLog->project_id)
            ->where('member_id', auth()->id())
            ->where('is_approver', true)
            ->exists();

        throw_if(auth()->id() !== $teamLeader->getKey() && ! $isApprover, new Exception('You are not authorized to approve this time log.'));
    }
}
