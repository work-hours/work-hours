<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'email_verified_at', 'currency', 'created_at'])
            ->withCount(['clients', 'projects', 'timeLogs'])
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    /**
     * Display the specified user details and related module information.
     */
    public function show(User $user): Response
    {
        $user->loadCount(['clients', 'projects', 'timeLogs']);

        $recentProjects = $user->projects()
            ->select(['id', 'name', 'created_at'])
            ->latest('created_at')
            ->limit(5)
            ->get();

        $recentClients = $user->clients()
            ->select(['id', 'name', 'created_at'])
            ->latest('created_at')
            ->limit(10)
            ->get();

        $recentAssignedTasks = $user->assignedTasks()
            ->select(['tasks.id', 'tasks.title', 'tasks.status', 'tasks.priority', 'tasks.due_date', 'tasks.created_at', 'tasks.project_id'])
            ->with(['project:id,name'])
            ->latest('tasks.created_at')
            ->limit(5)
            ->get();

        $recentTimeLogs = TimeLog::query()
            ->select(['id', 'project_id', 'task_id', 'created_at'])
            ->selectRaw('start_timestamp as started_at, end_timestamp as ended_at, duration as duration_minutes')
            ->with(['project:id,name', 'task:id,title'])
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->limit(5)
            ->get();

        $recentInvoices = Invoice::query()
            ->select(['id', 'status', 'currency', 'created_at'])
            ->selectRaw('invoice_number as number, total_amount as total')
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'profile_photo_url' => $user->profile_photo_url,
                'hourly_rate' => $user->hourly_rate,
                'currency' => $user->currency,
                'created_at' => $user->created_at,
                'clients_count' => $user->clients_count,
                'projects_count' => $user->projects_count,
                'time_logs_count' => $user->time_logs_count,
            ],
            'recent' => [
                'projects' => $recentProjects,
                'clients' => $recentClients,
                'assignedTasks' => $recentAssignedTasks,
                'timeLogs' => $recentTimeLogs,
                'invoices' => $recentInvoices,
            ],
            'teams' => [
                'members' => Team::query()
                    ->select(['user_id', 'member_id', 'hourly_rate', 'currency', 'non_monetary', 'is_employee'])
                    ->with(['member:id,name,email'])
                    ->where('user_id', $user->id)
                    ->latest('id')
                    ->limit(10)
                    ->get(),
                'memberOf' => Team::query()
                    ->select(['user_id', 'member_id', 'hourly_rate', 'currency', 'non_monetary', 'is_employee'])
                    ->with(['user:id,name,email'])
                    ->where('member_id', $user->id)
                    ->latest('id')
                    ->limit(10)
                    ->get(),
            ],
        ]);
    }
}
