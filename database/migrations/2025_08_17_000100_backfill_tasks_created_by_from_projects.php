<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        $tasks = App\Models\Task::query()->whereNull('created_by')->get();

        foreach ($tasks as $task) {
            $task->created_by = $task->project->user_id;
            $task->save();
        }
    }

    public function down(): void
    {
        // Intentionally left blank: data backfill is not easily reversible without risking data loss.
        // If needed, you may manually nullify created_by for specific rows.
    }
};
