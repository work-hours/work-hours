<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Only run this raw statement on MySQL-compatible drivers.
        $driver = DB::getDriverName();
        if (in_array($driver, ['mysql', 'mariadb'], true)) {
            DB::statement('ALTER TABLE time_logs MODIFY COLUMN note TEXT NULL');
        }
        // For SQLite and others, skip since altering column nullability is not supported easily.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No-op: reverting nullability change would require full column rebuild on some drivers.
    }
};
