<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;

final class AddData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-data {user_id? : The ID of the logged-in user}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add sample data: 5 team members with 20 time log entries each, and 20 time log entries for the logged-in user';

    public function handle(): int
    {
        $loggedInUserId = $this->argument('user_id');

        if (! $loggedInUserId) {
            $this->error('No user ID provided. Please provide a user ID.');

            return 1;
        }

        $loggedInUser = User::query()->find($loggedInUserId);

        if (! $loggedInUser) {
            $this->error('User not found with ID: ' . $loggedInUserId);

            return 1;
        }

        $this->info('Creating 5 team members...');

        $teamMembers = User::factory()->count(5)->create();

        $this->info('Created team members:');
        foreach ($teamMembers as $member) {
            $this->line("- {$member->name} (ID: {$member->getKey()})");
            Team::query()->create([
                'user_id' => $loggedInUser->getKey(),
                'member_id' => $member->getKey(),
                'hourly_rate' => random_int(10, 100),
                'currency' => 'USD',
            ]);
        }

        $this->info('Creating projects for the logged-in user...');

        $projects = [];
        for ($i = 1; $i <= 3; $i++) {
            $project = Project::query()->create([
                'user_id' => $loggedInUser->getKey(),
                'name' => "Project {$i}",
                'description' => "Description for Project {$i}",
            ]);
            $projects[] = $project;

            $this->line("- Created project: {$project->name} (ID: {$project->getKey()})");

            $randomMembers = $teamMembers->random(random_int(1, 3));
            foreach ($randomMembers as $member) {
                $project->teamMembers()->attach($member->getKey());
                $this->line("  - Assigned {$member->name} to {$project->name}");
            }
        }

        $this->info('Adding 20 time log entries for each team member...');

        foreach ($teamMembers as $member) {
            $memberProjects = collect($projects)->filter(fn ($project) => $project->teamMembers->contains('id', $member->getKey()))->values();

            if ($memberProjects->isEmpty()) {
                $this->warn("- {$member->name} is not assigned to any projects, skipping time logs");

                continue;
            }

            $this->createTimeLogEntries($member, 20, $memberProjects);
        }

        $this->info('Adding 20 time log entries for the logged-in user...');

        $this->createTimeLogEntries($loggedInUser, 20, collect($projects));

        $this->info('Data generation completed successfully!');

        return 0;
    }

    private function createTimeLogEntries(User $user, int $count, Collection $projects): void
    {
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subMonths(2);

        $intervalDays = $endDate->diffInDays($startDate) / $count;

        for ($i = 0; $i < $count; $i++) {
            $entryDate = clone $startDate;
            $entryDate->addDays(ceil($i * $intervalDays));

            $entryDate->setHour(random_int(9, 16));
            $entryDate->setMinute(random_int(0, 59));
            $entryDate->setSecond(random_int(0, 59));

            $durationHours = random_int(30, 240) / 60;

            $endTimestamp = clone $entryDate;
            $endTimestamp->addMinutes($durationHours * 60);

            $project = $projects->random();

            TimeLog::query()->create([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'start_timestamp' => $entryDate,
                'end_timestamp' => $endTimestamp,
                'duration' => round($durationHours, 2),
                'is_paid' => (bool) random_int(0, 1),
            ]);
        }
    }
}
