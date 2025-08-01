<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks_meta', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->onDelete('cascade');
            $table->string('source')->nullable(); // The source of imported task (e.g., 'github')
            $table->string('source_id')->nullable(); // External ID (e.g., GitHub issue ID)
            $table->string('source_number')->nullable(); // External issue number (e.g., #123)
            $table->string('source_url')->nullable(); // URL to the original issue
            $table->string('source_state')->nullable(); // Original state (open, closed, etc.)
            $table->json('extra_data')->nullable(); // Additional metadata in JSON format
            $table->timestamps();

            // Indexes for faster querying
            $table->index('source');
            $table->index('source_id');
            $table->index('source_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks_meta');
    }
};
