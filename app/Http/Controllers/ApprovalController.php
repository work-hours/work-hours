<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\TimeLogStatus;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Models\TimeLog;
use App\Services\ApprovalService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Throwable;

final class ApprovalController extends Controller
{
    public function __construct(public ApprovalService $approvalService) {}

    /**
     * Get the count of pending approvals for the current user
     */
    #[Action(method: 'get', name: 'approvals.count', middleware: ['auth', 'verified'])]
    public function count(): JsonResponse
    {
        $pendingTimeLogs = $this->approvalService->getPendingApprovals();
        $count = $pendingTimeLogs->count();

        return response()->json([
            'count' => $count,
        ]);
    }

    public function index()
    {
        $pendingTimeLogs = $this->approvalService->getPendingApprovals();
        $mappedTimeLogs = TimeLogStore::timeLogMapper($pendingTimeLogs);
        $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
        $projects = ProjectStore::userProjects(userId: auth()->id());

        $teamMembers = TeamStore::teamMembers(userId: auth()->id());

        return Inertia::render('approvals/index', [
            'timeLogs' => $mappedTimeLogs,
            'filters' => TimeLogStore::filters(),
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

            $this->approvalService->processTimeLog($timeLog, TimeLogStatus::APPROVED, request('comment'));

            DB::commit();

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
            [$processed, $skipped] = $this->approvalService->processMultipleTimeLogs($timeLogIds, TimeLogStatus::APPROVED, request('comment'));

            DB::commit();

            $message = $processed . ' time logs approved successfully.';
            if ($skipped > 0) {
                $message .= ' ' . $skipped . ' time logs were skipped because you are not authorized to approve them.';
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

            $this->approvalService->processTimeLog($timeLog, TimeLogStatus::REJECTED, request('comment'));

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
     * Reject multiple time log entries
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'approvals.reject-multiple', middleware: ['auth', 'verified'])]
    public function rejectMultiple(): JsonResponse
    {
        $timeLogIds = request('time_log_ids', []);

        abort_if(empty($timeLogIds), 400, 'No time logs selected.');

        DB::beginTransaction();
        try {
            [$processed, $skipped] = $this->approvalService->processMultipleTimeLogs($timeLogIds, TimeLogStatus::REJECTED, request('comment'));

            DB::commit();

            $message = $processed . ' time logs rejected successfully.';
            if ($skipped > 0) {
                $message .= ' ' . $skipped . ' time logs were skipped because you are not authorized to reject them.';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to reject time logs: ' . $e->getMessage(),
            ], 500);
        }
    }
}
