<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Models\Project;
use App\Models\TimeLog;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class ProjectController extends Controller
{
    use ExportableTrait;

    public function index()
    {
        return Inertia::render('project/index');
    }

    #[Action(method: 'get', name: 'project.list', middleware: ['auth', 'verified'])]
    public function projects(): Collection
    {
        return ProjectStore::userProjects(userId: auth()->id());
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

            if ($request->has('team_members')) {
                $project->teamMembers()->sync($request->input('team_members'));
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function create()
    {
        $teamMembers = TeamStore::teamMembers(userId: auth()->id())
            ->map(fn ($team): array => [
                'id' => $team->member->id,
                'name' => $team->member->name,
                'email' => $team->member->email,
            ]);

        return Inertia::render('project/create', [
            'teamMembers' => $teamMembers,
        ]);
    }

    public function edit(Project $project)
    {
        Gate::authorize('update', $project);

        $teamMembers = TeamStore::teamMembers(userId: auth()->id())
            ->map(fn ($team): array => [
                'id' => $team->member->id,
                'name' => $team->member->name,
                'email' => $team->member->email,
            ]);

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
        Gate::authorize('update', $project);

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

    /**
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'project.destroy', params: ['project'], middleware: ['auth', 'verified'])]
    public function destroy(Project $project): void
    {
        Gate::authorize('delete', $project);

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
    public function projectExport(): StreamedResponse
    {
        $headers = ['ID', 'Name', 'Description', 'Owner', 'Team Members', 'Created At'];
        $filename = 'projects_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv(ProjectStore::userProjects(userId: auth()->id())->map(fn ($project): array => [
            'id' => $project->id,
            'name' => $project->name,
            'description' => $project->description,
            'owner' => $project->user->name,
            'team_members' => $project->teamMembers->pluck('name')->implode(', '),
            'created_at' => Carbon::parse($project->created_at)->toDateTimeString(),
        ]), $headers, $filename);
    }

    public function timeLogs(Project $project)
    {
        Gate::authorize('viewTimeLogs', $project);

        $timeLogs = ProjectStore::timeLogs(project: $project);
        $unpaidAmount = ProjectStore::unpaidAmount(timeLogs: $timeLogs);

        $timeLogs = ProjectStore::timeLogMapper(timeLogs: $timeLogs);
        $totalDuration = round($timeLogs->sum('duration'), 2);
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        $teamMembers = ProjectStore::teamMembers(project: $project);

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
        ]);
    }

    #[Action(method: 'get', name: 'project.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        request()->validate([
            'project_id' => 'required|exists:projects,id',
        ]);

        $project = Project::query()->findOrFail(request('project_id'));

        $isCreator = $project->user_id === auth()->id();
        $isTeamMember = $project->teamMembers()->where('users.id', auth()->id())->exists();

        abort_if(! $isCreator && ! $isTeamMember, 403, 'You do not have access to this project.');

        $query = TimeLog::query()->where('project_id', $project->id);

        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        if (request()->get('user_id') && request('user_id')) {
            if ($isCreator) {
                $query->where('user_id', request('user_id'));
            } else {
                $query->where('user_id', auth()->id());
            }
        }

        if (request()->get('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with(['user'])->get();

        $timeLogsData = $timeLogs->map(fn ($timeLog): array => [
            'id' => $timeLog->id,
            'user_name' => $timeLog->user ? $timeLog->user->name : 'Unknown',
            'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
            'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : 'In Progress',
            'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
            'is_paid' => $timeLog->is_paid ? 'Paid' : 'Unpaid',
        ]);

        $headers = ['ID', 'Team Member', 'Start Time', 'End Time', 'Duration (hours)', 'Payment Status'];
        $filename = 'project_time_logs_' . $project->id . '_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($timeLogsData, $headers, $filename);
    }
}
