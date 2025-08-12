<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\GitHubAdapter;
use App\Adapters\JiraAdapter;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TaskStore;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskCompleted;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class TaskController extends Controller
{
    use ExportableTrait;

    /**
     * Constructor for TaskController
     */
    public function __construct(
        private readonly GitHubAdapter $gitHubAdapter,
        private readonly JiraAdapter $jiraAdapter
    ) {}

    /**
     * Store a new comment on a task.
     */
    public function storeComment(Task $task): void
    {

        $task->load(['project', 'assignees']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isTeamMember = $task->project->teamMembers->contains('id', auth()->id());
        $isAssignee = $task->assignees->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isTeamMember && ! $isAssignee, 403, 'Unauthorized action.');

        request()->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        TaskComment::query()->create([
            'task_id' => $task->id,
            'user_id' => auth()->id(),
            'body' => request('body'),
        ]);

        back()->throwResponse();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = ProjectStore::userProjects(userId: auth()->id())
            ->map(fn ($project): array => [
                'id' => $project->id,
                'name' => $project->name,
            ]);

        $tags = Tag::all()->map(fn ($tag): array => [
            'id' => $tag->id,
            'name' => $tag->name,
            'color' => $tag->color,
        ]);

        $filters = request()->only([
            'status',
            'priority',
            'project',
            'tag',
            'due-date-from',
            'due-date-to',
            'search',
        ]);

        return Inertia::render('task/index', [
            'projects' => $projects,
            'tags' => $tags,
            'filters' => $filters,
        ]);
    }

    #[Action(method: 'get', name: 'task.list', middleware: ['auth', 'verified'])]
    public function tasks(): Collection
    {
        return TaskStore::userTasks(userId: auth()->id());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = ProjectStore::userProjects(userId: auth()->id())
            ->map(fn ($project): array => [
                'id' => $project->id,
                'name' => $project->name,
                'source' => $project->source,
                'is_github' => $project->source === 'github',
            ]);

        return Inertia::render('task/create', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'task.store', middleware: ['auth', 'verified'])]
    public function store(StoreTaskRequest $request): void
    {
        DB::beginTransaction();
        try {
            $task = Task::query()->create([
                'project_id' => $request->input('project_id'),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'status' => $request->input('status'),
                'priority' => $request->input('priority', 'medium'),
                'due_date' => $request->input('due_date'),
            ]);

            if ($request->has('assignees')) {
                $task->assignees()->sync($request->input('assignees'));

                $task->load('project');

                $assigneeIds = $request->input('assignees');
                $users = User::query()->whereIn('id', $assigneeIds)->get();
                foreach ($users as $user) {
                    $user->notify(new TaskAssigned($task, auth()->user()));
                }
            }

            if ($request->has('tags')) {
                $this->attachTags($request->input('tags'), $task);
            }

            DB::commit();

            if ($request->boolean('create_github_issue')) {
                $this->gitHubAdapter->createGitHubIssue($task);
            }

            if ($request->boolean('create_jira_issue')) {
                $this->jiraAdapter->createJiraIssue($task);
            }
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    #[Action(method: 'get', name: 'task.show', params: ['task'], middleware: ['auth', 'verified'])]
    public function show(Task $task): Task
    {

        $task->load(['project', 'assignees']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isTeamMember = $task->project->teamMembers->contains('id', auth()->id());
        $isAssignee = $task->assignees->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isTeamMember && ! $isAssignee, 403, 'Unauthorized action.');

        return $task;
    }

    /**
     * Show task details page.
     */
    public function detail(Task $task)
    {
        $task->load(['project', 'assignees', 'tags', 'comments.user']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isTeamMember = $task->project->teamMembers->contains('id', auth()->id());
        $isAssignee = $task->assignees->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isTeamMember && ! $isAssignee, 403, 'Unauthorized action.');

        return Inertia::render('task/detail', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {

        $task->load(['project', 'assignees', 'meta', 'tags']);

        $isProjectOwner = $task->project->user_id === auth()->id();

        abort_if(! $isProjectOwner, 403, 'Unauthorized action.');

        $projects = ProjectStore::userProjects(userId: auth()->id())
            ->map(fn ($project): array => [
                'id' => $project->id,
                'name' => $project->name,
            ]);

        $potentialAssignees = collect([$task->project->user])
            ->concat($task->project->teamMembers)
            ->unique('id')
            ->map(fn ($user): array => [
                'id' => $user->id,
                'name' => $user->name,
            ]);

        $assignedUsers = $task->assignees->pluck('id')->toArray();
        $taskTags = $task->tags->pluck('name')->toArray();

        $isGithub = $task->is_imported && $task->meta && $task->meta->source === 'github';
        $isJira = $task->is_imported && $task->meta && $task->meta->source === 'jira';

        return Inertia::render('task/edit', [
            'task' => $task,
            'projects' => $projects,
            'potentialAssignees' => $potentialAssignees,
            'assignedUsers' => $assignedUsers,
            'taskTags' => $taskTags,
            'isGithub' => $isGithub,
            'isJira' => $isJira,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'task.update', params: ['task'], middleware: ['auth', 'verified'])]
    public function update(UpdateTaskRequest $request, Task $task): void
    {

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isAssignee = $task->assignees->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isAssignee, 403, 'Unauthorized action.');

        DB::beginTransaction();
        try {

            $oldStatus = $task->status;

            $currentAssigneeIds = $task->assignees->pluck('id')->toArray();

            if ($isProjectOwner) {
                $task->update($request->only(['title', 'description', 'status', 'priority', 'due_date']));

                if ($request->has('assignees')) {
                    $newAssigneeIds = $request->input('assignees');
                    $task->assignees()->sync($newAssigneeIds);

                    $addedAssigneeIds = array_diff($newAssigneeIds, $currentAssigneeIds);

                    if ($addedAssigneeIds !== []) {

                        $task->load('project');

                        $newUsers = User::query()->whereIn('id', $addedAssigneeIds)->get();
                        foreach ($newUsers as $user) {
                            $user->notify(new TaskAssigned($task, auth()->user()));
                        }
                    }
                } else {
                    $task->assignees()->detach();
                }
            } else {
                $task->update($request->only(['status']));
            }

            if ($oldStatus !== 'completed' && $request->input('status') === 'completed' && ! $isProjectOwner) {
                if (! $task->relationLoaded('project')) {
                    $task->load('project');
                }

                $projectOwner = User::query()->find($task->project->user_id);
                $projectOwner->notify(new TaskCompleted($task, auth()->user()));
            }

            if ($request->has('tags')) {
                $this->attachTags($request->input('tags'), $task);
            }

            DB::commit();

            if ($task->is_imported && $task->meta && $task->meta->source === 'github' && $request->boolean('github_update')) {
                $this->gitHubAdapter->updateGitHubIssue($task);
            }

            if ($task->is_imported && $task->meta && $task->meta->source === 'jira' && $request->boolean('jira_update')) {
                $this->jiraAdapter->updateJiraIssue($task);
            }
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'task.destroy', params: ['task'], middleware: ['auth', 'verified'])]
    public function destroy(Task $task): void
    {
        $isProjectOwner = $task->project->user_id === auth()->id();

        abort_if(! $isProjectOwner, 403, 'Unauthorized action.');

        DB::beginTransaction();
        try {
            if (request()->boolean('delete_from_github') && $task->is_imported && $task->meta && $task->meta->source === 'github') {
                $this->gitHubAdapter->deleteGitHubIssue($task);
            }

            if (request()->boolean('delete_from_jira') && $task->is_imported && $task->meta && $task->meta->source === 'jira') {
                $this->jiraAdapter->deleteJiraIssue($task);
            }

            $task->assignees()->detach();

            $task->delete();

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Export tasks to CSV.
     */
    #[Action(method: 'get', name: 'task.export', middleware: ['auth', 'verified'])]
    public function exportTasks(): StreamedResponse
    {
        $tasks = TaskStore::userTasks(userId: auth()->id());
        $mappedTasks = TaskStore::taskExportMapper(tasks: $tasks);
        $headers = TaskStore::taskExportHeaders();
        $filename = 'tasks_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($mappedTasks, $headers, $filename);
    }

    /**
     * Get potential assignees for a project.
     */
    #[Action(method: 'get', name: 'task.potential-assignees', params: ['project'], middleware: ['auth', 'verified'])]
    public function potentialAssignees(Project $project): Collection
    {
        $isProjectOwner = $project->user_id === auth()->id();
        $isTeamMember = $project->teamMembers->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isTeamMember, 403, 'Unauthorized action.');

        return collect([$project->user])
            ->concat($project->teamMembers)
            ->unique('id')
            ->map(fn ($user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    /**
     * Get the count of pending tasks for the current user
     */
    #[Action(method: 'get', name: 'tasks.count', middleware: ['auth', 'verified'])]
    public function count()
    {
        $pendingTasksCount = Task::query()->where('status', 'pending')
            ->whereHas('assignees', function ($query): void {
                $query->where('user_id', auth()->id());
            })
            ->count();

        return response()->json([
            'count' => $pendingTasksCount,
        ]);
    }

    /**
     * Attach tags to a task
     */
    private function attachTags(array $tags, Task $task): void
    {
        $tagIds = [];

        foreach ($tags as $tagName) {
            $tag = Tag::query()->firstOrCreate([
                'name' => $tagName,
                'user_id' => auth()->id(),
            ]);

            $tagIds[] = $tag->id;
        }

        $task->tags()->sync($tagIds);
    }
}
