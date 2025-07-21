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
    public static function userTasks(int $userId): Collection
    {
        // Get tasks from projects owned by the user
        $ownedProjectTasks = Task::query()
            ->whereHas('project', function ($query) use ($userId): void {
                $query->where('user_id', $userId);
            })
            ->with(['project', 'assignees'])
            ->get();

        // Get tasks assigned to the user
        $assignedTasks = Task::query()
            ->whereHas('assignees', function ($query) use ($userId): void {
                $query->where('users.id', $userId);
            })
            ->with(['project', 'assignees'])
            ->get();

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
