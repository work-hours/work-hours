<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

final class TaskStore
{
    /**
     * Apply filters to a task query
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param array $filters
     * @return void
     */
    private static function applyFilters($query, array $filters): void
    {
        // Filter by status
        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }

        // Filter by priority
        if (isset($filters['priority']) && $filters['priority']) {
            $query->where('priority', $filters['priority']);
        }

        // Filter by project
        if (isset($filters['project_id']) && $filters['project_id']) {
            $query->where('project_id', $filters['project_id']);
        }

        // Filter by due date range
        if (isset($filters['due_date_from']) && $filters['due_date_from']) {
            $query->whereDate('due_date', '>=', $filters['due_date_from']);
        }

        if (isset($filters['due_date_to']) && $filters['due_date_to']) {
            $query->whereDate('due_date', '<=', $filters['due_date_to']);
        }

        // Filter by search term (title or description)
        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }
    }
    public static function userTasks(int $userId, array $filters = []): Collection
    {
        // Get tasks from projects owned by the user
        $ownedProjectTasksQuery = Task::query()
            ->whereHas('project', function ($query) use ($userId): void {
                $query->where('user_id', $userId);
            })
            ->with(['project', 'assignees']);

        // Get tasks assigned to the user
        $assignedTasksQuery = Task::query()
            ->whereHas('assignees', function ($query) use ($userId): void {
                $query->where('users.id', $userId);
            })
            ->with(['project', 'assignees']);

        // Apply filters to both queries
        self::applyFilters($ownedProjectTasksQuery, $filters);
        self::applyFilters($assignedTasksQuery, $filters);

        $ownedProjectTasks = $ownedProjectTasksQuery->get();
        $assignedTasks = $assignedTasksQuery->get();

        // Combine and remove duplicates
        return $ownedProjectTasks->concat($assignedTasks)->unique('id');
    }

    public static function projectTasks(Project $project): Collection
    {
        return Task::query()
            ->where('project_id', $project->id)
            ->with(['assignees'])
            ->get();
    }

    public static function taskExportMapper(Collection $tasks): Collection
    {
        return $tasks->map(fn ($task): array => [
            'id' => $task->id,
            'project' => $task->project->name,
            'title' => $task->title,
            'description' => $task->description,
            'status' => ucfirst(str_replace('_', ' ', $task->status)),
            'priority' => ucfirst((string) $task->priority),
            'due_date' => $task->due_date ? Carbon::parse($task->due_date)->toDateString() : 'No due date',
            'assignees' => $task->assignees->pluck('name')->implode(', '),
            'created_at' => Carbon::parse($task->created_at)->toDateTimeString(),
        ]);
    }

    public static function taskExportHeaders(): array
    {
        return [
            'ID',
            'Project',
            'Title',
            'Description',
            'Status',
            'Priority',
            'Due Date',
            'Assignees',
            'Created At',
        ];
    }
}
