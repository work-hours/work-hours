<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

final class TasksRecurCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * Supported frequencies: daily, weekly, every_other_week, monthly
     */
    protected $signature = 'tasks:recur {frequency : Recurrence frequency (daily|weekly|every_other_week|monthly)}';

    /**
     * The console command description.
     */
    protected $description = 'Create next occurrences for recurring tasks matching the given frequency when due.';

    public function handle(): int
    {
        $frequency = (string) $this->argument('frequency');
        $allowed = ['daily', 'weekly', 'every_other_week', 'monthly'];

        if (! in_array($frequency, $allowed, true)) {
            $this->error('Invalid frequency. Allowed: ' . implode(',', $allowed));

            return self::FAILURE;
        }

        $today = Carbon::today();

        $query = Task::query()
            ->where('is_recurring', true)
            ->where('recurring_frequency', $frequency)
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<=', $today->toDateString());

        $count = 0;

        $query->chunkById(200, function ($tasks) use (&$count, $frequency): void {
            foreach ($tasks as $task) {
                $nextDue = $this->nextDueDate(Carbon::parse($task->due_date), $frequency);
                $exists = Task::query()
                    ->where('project_id', $task->project_id)
                    ->where('title', $task->title)
                    ->whereDate('due_date', $nextDue->toDateString())
                    ->exists();

                if ($exists) {
                    continue;
                }

                DB::transaction(function () use ($task, $nextDue, &$count): void {
                    $new = Task::query()->create([
                        'project_id' => $task->project_id,
                        'created_by' => $task->created_by,
                        'title' => $task->title,
                        'description' => $task->description,
                        'status' => 'pending', // new cycle starts pending
                        'priority' => $task->priority,
                        'due_date' => $nextDue->toDateString(),
                        'is_imported' => false,
                        'is_recurring' => $task->is_recurring,
                        'recurring_frequency' => $task->recurring_frequency,
                    ]);
                    $assigneeIds = $task->assignees()->pluck('users.id')->all();
                    if ($assigneeIds !== []) {
                        $new->assignees()->sync($assigneeIds);
                    }
                    $tagIds = $task->tags()->pluck('tags.id')->all();
                    if ($tagIds !== []) {
                        $new->tags()->sync($tagIds);
                    }

                    $count++;
                });
            }
        });

        $this->info("Created {$count} recurring task(s) for frequency '{$frequency}'.");

        return self::SUCCESS;
    }

    private function nextDueDate(Carbon $current, string $frequency): Carbon
    {
        return match ($frequency) {
            'daily' => $current->clone()->addDay(),
            'weekly' => $current->clone()->addWeek(),
            'every_other_week' => $current->clone()->addWeeks(2),
            'monthly' => $current->clone()->addMonthNoOverflow(),
            default => $current,
        };
    }
}
