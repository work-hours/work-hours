<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Adapters\GitHubAdapter;
use App\Adapters\JiraAdapter;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TagStore;
use App\Http\Stores\TaskStore;
use App\Models\Project;
use App\Models\Tag;
use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use App\Notifications\TaskAssigned;
use App\Notifications\TaskCommented;
use App\Notifications\TaskCompleted;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Concurrency;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

    #[Action(method: 'post', name: 'task.comments.store', params: ['task'], middleware: ['auth', 'verified'])]
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

        $comment = TaskComment::query()->create([
            'task_id' => $task->id,
            'user_id' => auth()->id(),
            'body' => request('body'),
        ]);

        $recipientIds = collect([$task->project->user_id])
            ->merge($task->assignees->pluck('id'))
            ->unique()
            ->reject(fn ($id): bool => $id === (int) auth()->id())
            ->values();

        $rawBody = (string) request('body');

        $textBody = mb_trim(strip_tags($rawBody));

        if ($textBody !== '' && preg_match_all('/@([A-Za-z0-9._-]+)/', $textBody, $matches)) {
            $handles = collect($matches[1] ?? [])->filter()->map(fn ($h): string => mb_strtolower($h))->unique()->values();

            if ($handles->isNotEmpty()) {
                $allowedUsers = collect([$task->project->user])
                    ->merge($task->project->teamMembers)
                    ->merge($task->assignees)
                    ->filter()
                    ->unique('id')
                    ->values();

                $normalize = static function (string $name): string {
                    $base = mb_strtolower($name);

                    return preg_replace('/[^a-z0-9._-]+/i', '', $base) ?? $base;
                };

                $handleToUserIds = collect();
                foreach ($allowedUsers as $u) {
                    $handle = $normalize($u->name);
                    if ($handle !== '') {
                        $handleToUserIds->put($handle, $u->id);
                    }

                    if (! empty($u->email) && str_contains($u->email, '@')) {
                        $local = mb_strtolower(strtok($u->email, '@'));
                        if ($local !== '0') {
                            $handleToUserIds->put($local, $u->id);
                        }
                    }
                }

                $mentionedIds = $handles
                    ->map(fn ($h) => $handleToUserIds->get($h))
                    ->filter()
                    ->unique()
                    ->values();

                if ($mentionedIds->isNotEmpty()) {
                    $recipientIds = $recipientIds->merge($mentionedIds)->unique()->values();
                }
            }
        }

        $recipientIdArray = $recipientIds
            ->reject(fn ($id): bool => $id === (int) auth()->id())
            ->values()
            ->all();

        if ($recipientIdArray !== []) {
            $users = User::query()->whereIn('id', $recipientIdArray)->get();
            foreach ($users as $user) {
                $user->notify(new TaskCommented($task, $comment, auth()->user()));
            }
        }

        back()->throwResponse();
    }

    #[Action(method: 'delete', name: 'task.comments.destroy', params: ['task', 'comment'], middleware: ['auth', 'verified'])]
    public function destroyComment(Task $task, TaskComment $comment): void
    {
        abort_if($comment->task_id !== $task->id, 404, 'Comment not found for this task.');

        $task->load(['project']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isCommentOwner = $comment->user_id === auth()->id();

        abort_if(! $isProjectOwner && ! $isCommentOwner, 403, 'Unauthorized action.');

        $comment->delete();

        back()->throwResponse();
    }

    #[Action(method: 'put', name: 'task.comments.update', params: ['task', 'comment'], middleware: ['auth', 'verified'])]
    public function updateComment(Task $task, TaskComment $comment): void
    {

        abort_if($comment->task_id !== $task->id, 404, 'Comment not found for this task.');

        $task->load(['project']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isCommentOwner = $comment->user_id === auth()->id();

        abort_if(! $isProjectOwner && ! $isCommentOwner, 403, 'Unauthorized action.');

        request()->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $comment->update([
            'body' => request('body'),
        ]);

        back()->throwResponse();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = (int) auth()->id();

        [$projects, $tags] = Concurrency::run([
            fn () => ProjectStore::userProjects(userId: $userId)
                ->map(fn ($project): array => [
                    'id' => $project->id,
                    'name' => $project->name,
                ]),
            fn (): Collection => TagStore::projectTags(userId: $userId, map: true),
        ]);

        return Inertia::render('task/index', [
            'projects' => $projects,
            'tags' => $tags,
            'filters' => TaskStore::filters(),
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
            $projectId = (int) $request->input('project_id');
            /** @var Project $project */
            $project = Project::query()->findOrFail($projectId);
            $isProjectOwner = $project->user_id === auth()->id();

            $task = Task::query()->create([
                'project_id' => $projectId,
                'created_by' => auth()->id(),
                'title' => $request->input('title'),
                'description' => $request->input('description'),
                'status' => $request->input('status'),
                'priority' => $request->input('priority', 'medium'),
                'due_date' => $request->input('due_date'),
            ]);

            // Enforce assignee restriction: if not project owner, only self can be an assignee
            $assigneeIds = $request->input('assignees', []);
            if (! $isProjectOwner) {
                $assigneeIds = [auth()->id()];
            }
            // If there are any assignees to sync, perform sync
            if ($assigneeIds !== []) {
                $task->assignees()->sync($assigneeIds);
            }

            if ($request->has('tags')) {
                $this->attachTags($request->input('tags'), $task);
            }

            $this->storeAttachments($request, $task);

            DB::commit();

            // Notify only the (possibly enforced) assignees
            $this->notifyAssignees($task, $assigneeIds);

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
        $task->load(['project', 'project.user', 'project.teamMembers', 'assignees', 'tags', 'comments.user', 'meta']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isTeamMember = $task->project->teamMembers->contains('id', auth()->id());
        $isAssignee = $task->assignees->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isTeamMember && ! $isAssignee, 403, 'Unauthorized action.');

        $taskId = (int) $task->id;

        [$files] = Concurrency::run([
            fn () => collect(Storage::disk('public')->files('tasks/' . $taskId))
                ->map(fn (string $path): array => [
                    'name' => basename($path),
                    'url' => Storage::disk('public')->url($path),
                    'size' => Storage::disk('public')->size($path),
                ]),
        ]);

        $normalize = static function (string $name): string {
            $base = mb_strtolower($name);

            return preg_replace('/[^a-z0-9._-]+/i', '', $base) ?? $base;
        };

        $mentionableUsers = collect([$task->project->user])
            ->merge($task->project->teamMembers)
            ->merge($task->assignees)
            ->filter()
            ->reject(fn ($u): bool => $u->id === auth()->id())
            ->unique('id')
            ->values()
            ->map(fn ($u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'handle' => $normalize($u->name),
                'email' => $u->email ?? null,
            ]);

        return Inertia::render('task/detail', [
            'task' => $task,
            'attachments' => $files,
            'mentionableUsers' => $mentionableUsers,
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

        $userId = (int) auth()->id();
        $taskId = (int) $task->id;

        [$projects, $files] = Concurrency::run([
            fn () => ProjectStore::userProjects(userId: $userId)
                ->map(fn ($project): array => [
                    'id' => $project->id,
                    'name' => $project->name,
                ]),
            fn () => collect(Storage::disk('public')->files('tasks/' . $taskId))
                ->map(fn (string $path): array => [
                    'name' => basename($path),
                    'url' => Storage::disk('public')->url($path),
                    'size' => Storage::disk('public')->size($path),
                ]),
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
            'attachments' => $files,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'task.update', params: ['task'], middleware: ['auth', 'verified'])]
    public function update(UpdateTaskRequest $request, Task $task): void
    {
        $isProjectOwner = $task->project->user_id === auth()->id();

        abort_if(! $isProjectOwner, 403, 'Unauthorized action.');

        DB::beginTransaction();
        try {

            $currentAssigneeIds = $task->assignees->pluck('id')->toArray();
            $oldStatus = $task->status;
            $task->update($request->only(['project_id', 'title', 'description', 'status', 'priority', 'due_date']));

            if ($request->has('assignees')) {
                $newAssigneeIds = $request->input('assignees');
                $task->assignees()->sync($newAssigneeIds);

                $addedAssigneeIds = array_diff($newAssigneeIds, $currentAssigneeIds);
            } else {
                $task->assignees()->detach();
            }

            if ($request->has('tags')) {
                $this->attachTags($request->input('tags'), $task);
            }

            $this->storeAttachments($request, $task);

            DB::commit();

            if ($request->has('assignees')) {
                $this->notifyAssignees($task, $addedAssigneeIds ?? []);
            }

            $this->notifyOnCompletion($task, $oldStatus, $isProjectOwner);

            $this->updateExternalIntegrations(
                $task,
                $request->boolean('github_update'),
                $request->boolean('jira_update')
            );
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'task.updateStatus', params: ['task'], middleware: ['auth', 'verified'])]
    public function updateStatus(Task $task): void
    {
        $task->loadMissing(['project', 'assignees', 'meta']);

        $isProjectOwner = $task->project->user_id === auth()->id();
        $isAssignee = $task->assignees->contains('id', auth()->id());

        abort_if(! $isProjectOwner && ! $isAssignee, 403, 'Unauthorized action.');

        request()->validate([
            'status' => ['required', 'string', 'in:pending,in_progress,completed'],
            'github_update' => ['sometimes', 'boolean'],
            'jira_update' => ['sometimes', 'boolean'],
        ]);

        DB::beginTransaction();
        try {

            $oldStatus = $task->status;

            $task->update([
                'status' => request('status'),
            ]);

            DB::commit();

            $this->notifyOnCompletion($task, $oldStatus, $isProjectOwner);

            $this->updateExternalIntegrations(
                $task,
                request()->boolean('github_update'),
                request()->boolean('jira_update')
            );
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
        $currentUserId = (int) auth()->id();
        $isProjectOwner = $project->user_id === $currentUserId;
        $isTeamMember = $project->teamMembers->contains('id', $currentUserId);

        abort_if(! $isProjectOwner && ! $isTeamMember, 403, 'Unauthorized action.');

        // If the current user is not the owner of the project, restrict potential assignees to self only
        if (! $isProjectOwner) {
            $user = auth()->user();

            return collect([
                [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
        }

        // Project owners can assign themselves and any team member
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

    #[Action(method: 'delete', name: 'task.attachments.destroy', params: ['task', 'filename'], middleware: ['auth', 'verified'])]
    public function destroyAttachment(Task $task, string $filename): void
    {
        $isProjectOwner = $task->project->user_id === auth()->id();
        abort_if(! $isProjectOwner, 403, 'Unauthorized action.');

        $basename = basename($filename);
        $path = 'tasks/' . $task->id . '/' . $basename;

        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        back()->throwResponse();
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

    /**
     * Store uploaded attachments for the given task.
     */
    private function storeAttachments(StoreTaskRequest|UpdateTaskRequest $request, Task $task): void
    {
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                if ($file) {
                    $file->storeAs('tasks/' . $task->id, $file->getClientOriginalName(), 'public');
                }
            }
        }
    }

    /**
     * Notify the given user IDs that they have been assigned to the task.
     *
     * @param  array<int>  $userIds
     */
    private function notifyAssignees(Task $task, array $userIds): void
    {
        if ($userIds === []) {
            return;
        }

        if (! $task->relationLoaded('project')) {
            $task->load('project');
        }

        $users = User::query()->whereIn('id', $userIds)->get();
        foreach ($users as $user) {
            $user->notify(new TaskAssigned($task, auth()->user()));
        }
    }

    /**
     * Notify project owner when task is completed by a non-owner.
     */
    private function notifyOnCompletion(Task $task, string $oldStatus, bool $isProjectOwner): void
    {
        if ($oldStatus === 'completed') {
            return;
        }

        $newStatus = $task->status;
        if ($newStatus === 'completed' && ! $isProjectOwner) {
            if (! $task->relationLoaded('project')) {
                $task->load('project');
            }

            $projectOwner = User::query()->find($task->project->user_id);
            $projectOwner?->notify(new TaskCompleted($task, auth()->user()));
        }
    }

    /**
     * Update external integrations for imported tasks when flags are enabled.
     */
    private function updateExternalIntegrations(Task $task, bool $githubUpdate, bool $jiraUpdate): void
    {
        $isGithub = $task->is_imported && $task->meta && $task->meta->source === 'github';
        $isJira = $task->is_imported && $task->meta && $task->meta->source === 'jira';

        if ($isGithub && $githubUpdate) {
            $this->gitHubAdapter->updateGitHubIssue($task);
        }

        if ($isJira && $jiraUpdate) {
            $this->jiraAdapter->updateJiraIssue($task);
        }
    }
}
