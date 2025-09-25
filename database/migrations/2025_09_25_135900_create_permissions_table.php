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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('module')->nullable();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('user_permission', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->unique(['user_id', 'permission_id']);
        });

        App\Models\Permission::query()->create([
            'module' => 'Team',
            'name' => 'List',
            'description' => 'List all team members',
        ]);

        App\Models\Permission::query()->create([
            'module' => 'Team',
            'name' => 'Create',
            'description' => 'Create a new team member',
        ]);

        App\Models\Permission::query()->create([
            'module' => 'Team',
            'name' => 'Update',
            'description' => 'Update a team member',
        ]);

        App\Models\Permission::query()->create([
            'module' => 'Team',
            'name' => 'Delete',
            'description' => 'Delete a team member',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};
