<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Stores\ClientStore;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
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
                'client_id' => $request->input('client_id'),
            ]);

            if ($request->has('team_members')) {
                $teamMembers = collect($request->input('team_members'))->mapWithKeys(function ($memberId) use ($request) {
                    $isApprover = $request->has('approvers') && in_array($memberId, $request->input('approvers'), true);

                    return [$memberId => ['is_approver' => $isApprover]];
                })->toArray();

                $project->teamMembers()->sync($teamMembers);
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

        $clients = ClientStore::userClients(auth()->id())
            ->map(fn ($client): array => [
                'id' => $client->id,
                'name' => $client->name,
            ]);

        return Inertia::render('project/create', [
            'teamMembers' => $teamMembers,
            'clients' => $clients,
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
        $assignedApprovers = $project->approvers->pluck('id')->toArray();

        $clients = ClientStore::userClients(auth()->id())
            ->map(fn ($client): array => [
                'id' => $client->id,
                'name' => $client->name,
            ]);

        return Inertia::render('project/edit', [
            'project' => $project,
            'teamMembers' => $teamMembers,
            'assignedTeamMembers' => $assignedTeamMembers,
            'assignedApprovers' => $assignedApprovers,
            'clients' => $clients,
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
            $project->update($request->only(['name', 'description', 'client_id']));

            if ($request->has('team_members')) {
                $teamMembers = collect($request->input('team_members'))->mapWithKeys(function ($memberId) use ($request) {
                    $isApprover = $request->has('approvers') && in_array($memberId, $request->input('approvers'), true);

                    return [$memberId => ['is_approver' => $isApprover]];
                })->toArray();

                $project->teamMembers()->sync($teamMembers);
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
        $headers = ['ID', 'Name', 'Description', 'Owner', 'Team Members', 'Approvers', 'Created At'];
        $filename = 'projects_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv(ProjectStore::projectExportMapper(
            projects: ProjectStore::userProjects(userId: auth()->id())),
            $headers,
            $filename
        );
    }

    public function timeLogs(Project $project)
    {
        Gate::authorize('viewTimeLogs', $project);

        $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('project_id', $project->getKey()));
        $unpaidAmount = TimeLogStore::unpaidAmountFromLogs(timeLogs: $timeLogs);
        $paidAmount = TimeLogStore::paidAmountFromLogs(timeLogs: $timeLogs);

        $mappedTimeLogs = TimeLogStore::timeLogMapper(timeLogs: $timeLogs);
        $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
        $unpaidHours = round($mappedTimeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        $teamMembers = ProjectStore::teamMembers(project: $project);

        return Inertia::render('project/time-logs', [
            'timeLogs' => $mappedTimeLogs,
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
            'paidAmount' => $paidAmount,
            'weeklyAverage' => $weeklyAverage,
        ]);
    }

    #[Action(method: 'get', name: 'project.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        request()->validate([
            'project_id' => ['required', 'integer', 'exists:projects,id'],
        ]);

        $project = Project::query()->findOrFail(request('project_id'));

        Gate::authorize('viewTimeLogs', $project);

        // Use the same base query as the timeLogs method, ensuring all filters are applied
        $timeLogsData = ProjectStore::exportTimeLogsMapper(
            timeLogs: TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('project_id', $project->getKey()))
        );

        $headers = ['ID', 'Team Member', 'Start Time', 'End Time', 'Duration (hours)', 'Payment Status', 'Note', 'Hourly Rate'];
        $filename = 'project_time_logs_' . $project->id . '_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($timeLogsData, $headers, $filename);
    }
}
