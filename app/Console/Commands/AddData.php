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

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        // Get or create the logged-in user
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

        // Create 5 team members
        $teamMembers = User::factory()->count(5)->create();

        $this->info('Created team members:');
        foreach ($teamMembers as $member) {
            $this->line("- {$member->name} (ID: {$member->getKey()})");
            Team::query()->create([
                'user_id' => $loggedInUser->getKey(),
                'member_id' => $member->getKey(),
                'hourly_rate' => random_int(10, 100), // Random hourly rate between 10 and 100
                'currency' => 'USD', // Default currency
            ]);
        }

        $this->info('Creating projects for the logged-in user...');

        // Create 3 projects for the logged-in user
        $projects = [];
        for ($i = 1; $i <= 3; $i++) {
            $project = Project::query()->create([
                'user_id' => $loggedInUser->getKey(),
                'name' => "Project {$i}",
                'description' => "Description for Project {$i}",
            ]);
            $projects[] = $project;

            $this->line("- Created project: {$project->name} (ID: {$project->getKey()})");

            // Assign random team members to this project
            $randomMembers = $teamMembers->random(random_int(1, 3));
            foreach ($randomMembers as $member) {
                $project->teamMembers()->attach($member->getKey());
                $this->line("  - Assigned {$member->name} to {$project->name}");
            }
        }

        $this->info('Adding 20 time log entries for each team member...');

        // Add 20 time log entries for each team member
        foreach ($teamMembers as $member) {
            // Get projects this member is assigned to
            $memberProjects = collect($projects)->filter(fn ($project) => $project->teamMembers->contains('id', $member->getKey()))->values();

            if ($memberProjects->isEmpty()) {
                $this->warn("- {$member->name} is not assigned to any projects, skipping time logs");

                continue;
            }

            $this->createTimeLogEntries($member, 20, $memberProjects);
        }

        $this->info('Adding 20 time log entries for the logged-in user...');

        // Add 20 time log entries for the logged-in user
        $this->createTimeLogEntries($loggedInUser, 20, collect($projects));

        $this->info('Data generation completed successfully!');

        return 0;
    }

    /**
     * Create time log entries for a user, distributed over the last 2 months
     */
    private function createTimeLogEntries(User $user, int $count, Collection $projects): void
    {
        // Get the date range for the last 2 months
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subMonths(2);

        // Calculate the interval between entries to distribute them evenly
        $intervalDays = $endDate->diffInDays($startDate) / $count;

        for ($i = 0; $i < $count; $i++) {
            // Calculate the date for this entry
            $entryDate = clone $startDate;
            $entryDate->addDays(ceil($i * $intervalDays));

            // Ensure the date is within working hours (9 AM to 5 PM)
            $entryDate->setHour(random_int(9, 16)); // Start between 9 AM and 4 PM
            $entryDate->setMinute(random_int(0, 59));
            $entryDate->setSecond(random_int(0, 59));

            // Create a random duration between 30 minutes and 4 hours
            $durationHours = random_int(30, 240) / 60; // Convert minutes to hours

            // Calculate end timestamp
            $endTimestamp = clone $entryDate;
            $endTimestamp->addMinutes($durationHours * 60);

            // Select a random project for this time log
            $project = $projects->random();

            // Create the time log entry
            TimeLog::query()->create([
                'user_id' => $user->id,
                'project_id' => $project->id,
                'start_timestamp' => $entryDate,
                'end_timestamp' => $endTimestamp,
                'duration' => round($durationHours, 2),
                'is_paid' => (bool) random_int(0, 1), // Randomly set as paid or unpaid
            ]);
        }
    }
}
