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
        // Insert the new Team permission: "View Time Logs" if it doesn't already exist.
        $exists = DB::table('permissions')
            ->where('module', 'Team')
            ->where('name', 'View Time Logs')
            ->exists();

        if (! $exists) {
            DB::table('permissions')->insert([
                'module' => 'Team',
                'name' => 'View Time Logs',
                'description' => 'View all team time logs',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('permissions')
            ->where('module', 'Team')
            ->where('name', 'View Time Logs')
            ->delete();
    }
};
