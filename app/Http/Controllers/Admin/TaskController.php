<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class TaskController extends Controller
{
    /**
     * Display a listing of all tasks.
     */
    public function index(Request $request): Response
    {
        $tasks = Task::query()
            ->select(['id', 'title', 'project_id', 'created_by', 'status', 'priority', 'due_date', 'created_at'])
            ->with(['project:id,name', 'creator:id,name'])
            ->withCount(['assignees', 'comments', 'tags'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }
}
