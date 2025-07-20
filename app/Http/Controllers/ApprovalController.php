<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Models\TimeLog;
use App\Models\User;
use App\Notifications\TimeLogApproved;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Throwable;

final class ApprovalController extends Controller
{
    public function index()
    {
        // Get all pending time logs for team members where the current user is a team leader or approver
        $pendingTimeLogs = $this->getPendingApprovals();
        $mappedTimeLogs = TimeLogStore::timeLogMapper($pendingTimeLogs);

        $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
        $projects = ProjectStore::userProjects(userId: auth()->id());

        $teamMembers = TeamStore::teamMembers(userId: auth()->id())
            ->map(fn ($teamMember): array => [
                'id' => $teamMember->member->getKey(),
                'name' => $teamMember->member->name,
                'email' => $teamMember->member->email,
            ]);

        return Inertia::render('approvals/index', [
            'timeLogs' => $mappedTimeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
                'user_id' => request('user_id', ''),
                'project_id' => request('project_id', ''),
            ],
            'projects' => $projects,
            'teamMembers' => $teamMembers,
            'totalDuration' => $totalDuration,
        ]);
    }

    /**
     * Approve a single time log entry
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'approvals.approve', middleware: ['auth', 'verified'])]
    public function approve(): JsonResponse
    {
        $timeLogId = request('time_log_id');

        abort_if(empty($timeLogId), 400, 'No time log selected.');

        DB::beginTransaction();
        try {
            $timeLog = TimeLog::query()->findOrFail($timeLogId);

            // Check if the user is authorized to approve this time log
            $this->authorizeApproval($timeLog);

            // Update the time log status
            $timeLog->update([
                'status' => 'approved',
                'approved_by' => auth()->id(),
                'approved_at' => Carbon::now(),
                'comment' => request('comment'),
            ]);

            DB::commit();

            // Notify the time log owner
            $timeLogOwner = User::query()->find($timeLog->user_id);
            if ($timeLogOwner && auth()->id() !== $timeLogOwner->getKey()) {
                $timeLogOwner->notify(new TimeLogApproved($timeLog, auth()->user()));
            }

            return response()->json([
                'success' => true,
                'message' => 'Time log approved successfully.',
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to approve time log: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Approve multiple time log entries
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'approvals.approve-multiple', middleware: ['auth', 'verified'])]
    public function approveMultiple(): JsonResponse
    {
        $timeLogIds = request('time_log_ids', []);

        abort_if(empty($timeLogIds), 400, 'No time logs selected.');

        DB::beginTransaction();
        try {
            $timeLogs = TimeLog::query()
                ->whereIn('id', $timeLogIds)
                ->get();

            $approvedCount = 0;
            $skippedCount = 0;

            foreach ($timeLogs as $timeLog) {
                // Check if the user is authorized to approve this time log
                try {
                    $this->authorizeApproval($timeLog);

                    // Update the time log status
                    $timeLog->update([
                        'status' => 'approved',
                        'approved_by' => auth()->id(),
                        'approved_at' => Carbon::now(),
                        'comment' => request('comment'),
                    ]);

                    $approvedCount++;

                    // Notify the time log owner
                    $timeLogOwner = User::query()->find($timeLog->user_id);
                    if ($timeLogOwner && auth()->id() !== $timeLogOwner->getKey()) {
                        $timeLogOwner->notify(new TimeLogApproved($timeLog, auth()->user()));
                    }
                } catch (Exception $e) {
                    $skippedCount++;
                }
            }

            DB::commit();

            $message = $approvedCount . ' time logs approved successfully.';
            if ($skippedCount > 0) {
                $message .= ' ' . $skippedCount . ' time logs were skipped because you are not authorized to approve them.';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to approve time logs: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reject a time log entry
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'approvals.reject', middleware: ['auth', 'verified'])]
    public function reject(): JsonResponse
    {
        $timeLogId = request('time_log_id');

        abort_if(empty($timeLogId), 400, 'No time log selected.');

        DB::beginTransaction();
        try {
            $timeLog = TimeLog::query()->findOrFail($timeLogId);

            // Check if the user is authorized to reject this time log
            $this->authorizeApproval($timeLog);

            // Update the time log status
            $timeLog->update([
                'status' => 'rejected',
                'approved_by' => auth()->id(),
                'approved_at' => Carbon::now(),
                'comment' => request('comment'),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Time log rejected successfully.',
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to reject time log: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all pending time logs for team members where the current user is a team leader or approver
     */
    private function getPendingApprovals()
    {
        // Get all projects where the current user is a team leader
        $leadProjects = ProjectStore::userProjects(userId: auth()->id())
            ->pluck('id')
            ->toArray();

        // Get all project-team entries where the current user is an approver
        $approverProjects = DB::table('project_team')
            ->where('member_id', auth()->id())
            ->where('is_approver', true)
            ->pluck('project_id')
            ->toArray();

        // Combine the projects
        $allProjects = array_unique(array_merge($leadProjects, $approverProjects));

        // Get all team members for these projects
        $teamMemberIds = DB::table('project_team')
            ->whereIn('project_id', $allProjects)
            ->where('member_id', '!=', auth()->id())
            ->pluck('member_id')
            ->toArray();

        // Get all pending time logs for these team members
        return TimeLogStore::timeLogs(
            baseQuery: TimeLog::query()
                ->whereIn('user_id', $teamMemberIds)
                ->whereIn('project_id', $allProjects)
                ->where('status', 'pending')
        );
    }

    /**
     * Check if the current user is authorized to approve/reject the given time log
     *
     * @throws Exception
     */
    private function authorizeApproval(TimeLog $timeLog): void
    {
        // Check if the current user is the team leader for the project
        $teamLeader = User::teamLeader(project: $timeLog->project);

        // Check if the current user is an approver for the project
        $isApprover = DB::table('project_team')
            ->where('project_id', $timeLog->project_id)
            ->where('member_id', auth()->id())
            ->where('is_approver', true)
            ->exists();

        if (auth()->id() !== $teamLeader->getKey() && !$isApprover) {
            throw new Exception('You are not authorized to approve this time log.');
        }
    }
}
