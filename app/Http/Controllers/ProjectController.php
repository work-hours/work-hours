<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Team;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Throwable;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::query()
            ->where('user_id', auth()->id())
            ->with('teamMembers')
            ->get();

        return Inertia::render('project/index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        $teamMembers = Team::query()
            ->where('user_id', auth()->id())
            ->with('member')
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->member->id,
                    'name' => $team->member->name,
                    'email' => $team->member->email,
                ];
            });

        return Inertia::render('project/create', [
            'teamMembers' => $teamMembers,
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'project.store', middleware: ['auth', 'verified'])]
    public function store(StoreProjectRequest $request): void
    {
        DB::beginTransaction();
        try {
            $project = Project::query()->create([
                'user_id' => auth()->id(),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
            ]);

            // Sync team members
            if ($request->has('team_members')) {
                $project->teamMembers()->sync($request->input('team_members'));
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function edit(Project $project)
    {
        // Check if the project belongs to the authenticated user
        if ($project->user_id !== auth()->id()) {
            abort(403, 'You can only edit your own projects.');
        }

        $teamMembers = Team::query()
            ->where('user_id', auth()->id())
            ->with('member')
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->member->id,
                    'name' => $team->member->name,
                    'email' => $team->member->email,
                ];
            });

        // Get the IDs of team members assigned to this project
        $assignedTeamMembers = $project->teamMembers->pluck('id')->toArray();

        return Inertia::render('project/edit', [
            'project' => $project,
            'teamMembers' => $teamMembers,
            'assignedTeamMembers' => $assignedTeamMembers,
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'project.update', params: ['project'], middleware: ['auth', 'verified'])]
    public function update(UpdateProjectRequest $request, Project $project): void
    {
        // Check if the project belongs to the authenticated user
        if ($project->user_id !== auth()->id()) {
            abort(403, 'You can only update your own projects.');
        }

        DB::beginTransaction();
        try {
            $project->update($request->only(['name', 'description']));

            // Sync team members
            if ($request->has('team_members')) {
                $project->teamMembers()->sync($request->input('team_members'));
            } else {
                $project->teamMembers()->detach();
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete the specified project.
     *
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'project.destroy', params: ['project'], middleware: ['auth', 'verified'])]
    public function destroy(Project $project): void
    {
        // Check if the project belongs to the authenticated user
        if ($project->user_id !== auth()->id()) {
            abort(403, 'You can only delete your own projects.');
        }

        DB::beginTransaction();
        try {
            $project->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
