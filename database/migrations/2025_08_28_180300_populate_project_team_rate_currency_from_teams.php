<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\ProjectTeam;
use App\Models\Team;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Populate project_team.hourly_rate and currency from teams defaults in two simple steps.
     */
    public function up(): void
    {
        $projectTeams = ProjectTeam::all();

        foreach ($projectTeams as $projectTeam) {
            $project = Project::query()->where('id', $projectTeam->project_id)->first();
            $teamEntry = Team::query()
                ->where('user_id', $project->user_id)
                ->where('member_id', $projectTeam->member_id)
                ->first();

            if ($teamEntry) {
                $projectTeam->hourly_rate = $teamEntry->hourly_rate;
                $projectTeam->currency = $teamEntry->currency;
                $projectTeam->save();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank: data backfill is not reversible without losing information.
    }
};
