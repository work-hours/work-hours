<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ProjectController extends Controller
{
    /**
     * Display a listing of all projects.
     */
    public function index(Request $request): Response
    {
        $projects = Project::query()
            ->select(['id', 'name', 'client_id', 'user_id', 'created_at'])
            ->with(['client:id,name', 'user:id,name'])
            ->withCount(['teamMembers', 'approvers', 'tasks', 'timeLogs'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
        ]);
    }
}
