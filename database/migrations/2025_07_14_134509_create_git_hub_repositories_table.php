<?php

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
        Schema::create('git_hub_repositories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('repo_id')->comment('GitHub repository ID');
            $table->string('name');
            $table->string('full_name');
            $table->text('description')->nullable();
            $table->string('html_url');
            $table->boolean('is_private');
            $table->boolean('is_organization')->default(false);
            $table->string('organization_name')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'repo_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('git_hub_repositories');
    }
};
