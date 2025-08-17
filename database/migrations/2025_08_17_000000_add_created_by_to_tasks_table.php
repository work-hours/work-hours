<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table): void {
            // Add created_by after project_id, nullable for existing rows, and reference users
            $table->foreignId('created_by')
                ->nullable()
                ->after('project_id')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table): void {
            // Drop foreign key then column
            $table->dropConstrainedForeignId('created_by');
        });
    }
};
