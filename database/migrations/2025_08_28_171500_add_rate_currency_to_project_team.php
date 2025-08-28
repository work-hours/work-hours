<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_team', function (Blueprint $table) {
            $table->decimal('hourly_rate', 10, 2)->nullable()->after('is_approver');
            $table->string('currency', 3)->nullable()->after('hourly_rate')->default('USD');
        });
    }

    public function down(): void
    {
        Schema::table('project_team', function (Blueprint $table) {
            $table->dropColumn(['hourly_rate', 'currency']);
        });
    }
};
