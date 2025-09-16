<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TimeLogStore;
use App\Models\Project;
use App\Services\ProjectService;
use App\Services\TimeLogService;
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

    public function __construct(
        private readonly ProjectService $projectService,
        private readonly TimeLogService $timeLogService,
    ) {}

    public function index()
    {
        $filters = request()->only([
            'client',
            'team-member',
            'created-date-from',
            'created-date-to',
            'search',
        ]);

        [$clients, $teamMembers] = $this->projectService->clientsAndTeamMembers(auth()->id());

        return Inertia::render('project/index', [
            'filters' => $filters,
            'clients' => $clients,
            'teamMembers' => $teamMembers,
            'currencies' => auth()->user()->currencies,
        ]);
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
        Gate::authorize('create', Project::class);
        DB::beginTransaction();
        try {
            $project = Project::query()->create([
                'user_id' => auth()->id(),
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'client_id' => $request->input('client_id'),
            ]);

            $teamMembers = $this->projectService->buildTeamMembersSyncFromRequest($request);
            if ($teamMembers !== null) {
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
        Gate::authorize('create', Project::class);

        [$clients, $teamMembers] = $this->projectService->clientsAndTeamMembers(auth()->id());

        return Inertia::render('project/create', [
            'teamMembers' => $teamMembers,
            'clients' => $clients,
            'currencies' => auth()->user()->currencies,
        ]);
    }

    public function edit(Project $project)
    {
        Gate::authorize('update', $project);

        [$clients, $teamMembers] = $this->projectService->clientsAndTeamMembers(auth()->id());

        $assignedTeamMembers = $project->teamMembers->pluck('id')->toArray();
        $assignedApprovers = $project->approvers->pluck('id')->toArray();
        $teamMemberRates = $project->teamMembers->mapWithKeys(fn ($member) => [
            $member->id => [
                'hourly_rate' => $member->pivot->hourly_rate,
                'currency' => $member->pivot->currency,
            ],
        ]);

        return Inertia::render('project/edit', [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'client_id' => $project->client_id,
                'source' => $project->source,
                'is_imported' => $project->source !== null,
            ],
            'teamMembers' => $teamMembers,
            'assignedTeamMembers' => $assignedTeamMembers,
            'assignedApprovers' => $assignedApprovers,
            'teamMemberRates' => $teamMemberRates,
            'clients' => $clients,
            'currencies' => auth()->user()->currencies,
        ]);
    }

    #[Action(method: 'get', name: 'project.edit-data', params: ['project'], middleware: ['auth', 'verified'])]
    public function editData(Project $project): array
    {
        Gate::authorize('update', $project);

        [$clients, $teamMembers] = $this->projectService->clientsAndTeamMembers(auth()->id());

        $assignedTeamMembers = $project->teamMembers->pluck('id')->toArray();
        $assignedApprovers = $project->approvers->pluck('id')->toArray();
        $teamMemberRates = $project->teamMembers->mapWithKeys(fn ($member) => [
            $member->id => [
                'hourly_rate' => $member->pivot->hourly_rate,
                'currency' => $member->pivot->currency,
            ],
        ]);

        return [
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'description' => $project->description,
                'client_id' => $project->client_id,
                'source' => $project->source,
                'is_imported' => $project->source !== null,
            ],
            'teamMembers' => $teamMembers,
            'assignedTeamMembers' => $assignedTeamMembers,
            'assignedApprovers' => $assignedApprovers,
            'teamMemberRates' => $teamMemberRates,
            'clients' => $clients,
            'currencies' => auth()->user()->currencies,
        ];
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

            $teamMembers = $this->projectService->buildTeamMembersSyncFromRequest($request);
            if ($teamMembers !== null) {
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
        $projects = ProjectStore::userProjects(userId: auth()->id());
        $mappedProjects = ProjectStore::projectExportMapper(projects: $projects);

        $headers = ['ID', 'Name', 'Description', 'Owner', 'Team Members', 'Approvers', 'Created At'];
        $filename = 'projects_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($mappedProjects, $headers, $filename);
    }

    #[Action(method: 'get', name: 'project.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        request()->validate([
            'project_id' => ['required', 'integer', 'exists:projects,id'],
        ]);

        $project = Project::query()->findOrFail(request('project_id'));

        abort_if($project->user_id !== auth()->id(), 403, 'Unauthorized action.');

        Gate::authorize('viewTimeLogs', $project);

        $timeLogs = TimeLogStore::timeLogs(baseQuery: $this->timeLogService->baseProjectQuery($project));
        $mappedTimeLogs = TimeLogStore::timeLogExportMapper(timeLogs: $timeLogs);
        $headers = TimeLogStore::timeLogExportHeaders();
        $filename = 'project_time_logs_' . $project->name . '_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($mappedTimeLogs, $headers, $filename);
    }

    public function timeLogs(Project $project)
    {
        Gate::authorize('viewTimeLogs', $project);

        $timeLogs = TimeLogStore::timeLogs(baseQuery: $this->timeLogService->baseProjectQuery($project));

        $teamMembers = ProjectStore::teamMembers(project: $project);

        return Inertia::render('project/time-logs', [
            'project' => $project,
            'teamMembers' => $teamMembers,
            ...TimeLogStore::resData(timeLogs: $timeLogs),
        ]);
    }
}
