<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class TimeLogController extends Controller
{
    /**
     * Display a listing of all time logs.
     */
    public function index(Request $request): Response
    {
        $timeLogs = TimeLog::query()
            ->select([
                'id',
                'user_id',
                'project_id',
                'task_id',
                'start_timestamp',
                'end_timestamp',
                'duration',
                'is_paid',
                'hourly_rate',
                'currency',
                'status',
                'created_at',
            ])
            ->with([
                'user:id,name',
                'project:id,name',
                'task:id,title',
            ])
            ->withCount(['tags'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/TimeLogs/Index', [
            'timeLogs' => $timeLogs,
        ]);
    }
}
