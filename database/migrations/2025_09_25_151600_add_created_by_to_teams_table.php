<?php

declare(strict_types=1);

use App\Models\Team;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table): void {
            $table->foreignId('created_by')->nullable()->after('member_id')->constrained('users')->nullOnDelete();
        });

        $teamMembers = Team::query()->get();
        foreach ($teamMembers as $teamMember) {
            $teamMember->created_by = $teamMember->user_id;
            $teamMember->save();
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('created_by');
        });
    }
};
