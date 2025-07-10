<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Msamgan\Lact\Attributes\Action;
use Throwable;

class ProjectController extends Controller
{
    use ExportableTrait;
    public function index()
    {
        $ownedProjects = Project::query()
            ->where('user_id', auth()->id())
            ->with(['teamMembers', 'user'])
            ->get();

        $assignedProjects = Project::query()
            ->whereHas('teamMembers', function ($query) {
                $query->where('users.id', auth()->id());
            })
            ->where('user_id', '!=', auth()->id())
            ->with(['teamMembers', 'user'])
            ->get();

        $projects = $ownedProjects->concat($assignedProjects);

        return Inertia::render('project/index', [
            'projects' => $projects,
            'auth' => [
                'user' => auth()->user(),
            ],
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

        $assignedTeamMembers = $project->teamMembers->pluck('id')->toArray();

        return Inertia::render('project/edit', [
            'project' => $project,
            'teamMembers' => $teamMembers,
            'assignedTeamMembers' => $assignedTeamMembers,
        ]);
    }

    #[Action(method: 'put', name: 'project.update', params: ['project'], middleware: ['auth', 'verified'])]
    public function update(UpdateProjectRequest $request, Project $project): void
    {
        if ($project->user_id !== auth()->id()) {
            abort(403, 'You can only update your own projects.');
        }

        DB::beginTransaction();
        try {
            $project->update($request->only(['name', 'description']));

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

    #[Action(method: 'delete', name: 'project.destroy', params: ['project'], middleware: ['auth', 'verified'])]
    public function destroy(Project $project): void
    {
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

    #[Action(method: 'get', name: 'project.export', middleware: ['auth', 'verified'])]
    public function export(): StreamedResponse
    {
        $ownedProjects = Project::query()
            ->where('user_id', auth()->id())
            ->with(['teamMembers', 'user'])
            ->get();

        $assignedProjects = Project::query()
            ->whereHas('teamMembers', function ($query) {
                $query->where('users.id', auth()->id());
            })
            ->where('user_id', '!=', auth()->id())
            ->with(['teamMembers', 'user'])
            ->get();

        $projects = $ownedProjects->concat($assignedProjects);

        $projectsData = $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'owner' => $project->user->name,
                'team_members' => $project->teamMembers->pluck('name')->implode(', '),
                'created_at' => Carbon::parse($project->created_at)->toDateTimeString(),
            ];
        });

        $headers = ['ID', 'Name', 'Description', 'Owner', 'Team Members', 'Created At'];
        $filename = 'projects_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($projectsData, $headers, $filename);
    }

    public function timeLogs(Project $project)
    {
        $isCreator = $project->user_id === auth()->id();

        if (!$isCreator) {
            abort(403, 'You do not have access to this project.');
        }

        $query = TimeLog::query()->where('project_id', $project->id);
        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        if (request()->get('user_id') && request('user_id')) {
            $query->where('user_id', request('user_id'));
        }

        if (request()->get('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with('user')->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'user_id' => $timeLog->user_id,
                    'user_name' => $timeLog->user ? $timeLog->user->name : null,
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                    'duration' => round($timeLog->duration, 2),
                    'is_paid' => $timeLog->is_paid,
                ];
            });

        $totalDuration = round($timeLogs->sum('duration'), 2);
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        // Calculate unpaid amount (this would need to be adjusted based on your business logic)
        $unpaidAmount = round($unpaidHours * 0, 2); // Placeholder, adjust as needed

        // Get team members for the dropdown
        $teamMembers = $project->teamMembers()
            ->get()
            ->map(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                ];
            });

        // Add the project creator to the team members list if not already included
        $creatorIncluded = $teamMembers->contains(function ($member) use ($project) {
            return $member['id'] === $project->user_id;
        });

        if (!$creatorIncluded) {
            $teamMembers->push([
                'id' => $project->user->id,
                'name' => $project->user->name,
                'email' => $project->user->email,
            ]);
        }

        return Inertia::render('project/time-logs', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
                'user_id' => request('user_id', ''),
                'is_paid' => request('is_paid', ''),
            ],
            'project' => $project,
            'teamMembers' => $teamMembers,
            'totalDuration' => $totalDuration,
            'unpaidHours' => $unpaidHours,
            'unpaidAmount' => $unpaidAmount,
            'weeklyAverage' => $weeklyAverage,
            'isCreator' => $isCreator,
        ]);
    }

    /**
     * Export project time logs to CSV
     *
     * @return StreamedResponse
     */
    #[Action(method: 'get', name: 'project.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        // Validate project_id parameter
        request()->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $project = Project::findOrFail(request('project_id'));

        // Check if the user has access to the project (either as creator or team member)
        $isCreator = $project->user_id === auth()->id();
        $isTeamMember = $project->teamMembers()->where('users.id', auth()->id())->exists();

        if (!$isCreator && !$isTeamMember) {
            abort(403, 'You do not have access to this project.');
        }

        $query = TimeLog::query()->where('project_id', $project->id);

        // Apply date filters if provided
        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        // Apply team member filter if provided
        if (request()->get('user_id') && request('user_id')) {
            // Validate that the user is either the project creator or a team member
            if ($isCreator) {
                // Project creator can see all team members' logs
                $query->where('user_id', request('user_id'));
            } else {
                // Team members can only see their own logs
                $query->where('user_id', auth()->id());
            }
        }

        // Apply paid/unpaid filter if provided
        if (request()->has('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with(['user'])->get();

        $timeLogsData = $timeLogs->map(function ($timeLog) {
            return [
                'id' => $timeLog->id,
                'user_name' => $timeLog->user ? $timeLog->user->name : 'Unknown',
                'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : 'In Progress',
                'duration' => round($timeLog->duration, 2),
                'is_paid' => $timeLog->is_paid ? 'Paid' : 'Unpaid',
            ];
        });

        $headers = ['ID', 'Team Member', 'Start Time', 'End Time', 'Duration (hours)', 'Payment Status'];
        $filename = 'project_time_logs_' . $project->id . '_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($timeLogsData, $headers, $filename);
    }
}
