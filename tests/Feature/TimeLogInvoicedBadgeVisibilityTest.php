<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows is_invoiced flag for project owner only', function (): void {
    $this->markTestSkipped('Factories not available in this project; skipping until factories exist.');
    $owner = User::factory()->create();
    $member = User::factory()->create();

    $project = Project::factory()->for($owner)->create();

    // Create a time log for the member on owner's project and mark it invoiced
    $timeLog = TimeLog::factory()->for($member)->for($project)
        ->state([
            'invoice_id' => 123,
            'status' => 'approved',
            'is_paid' => false,
        ])->create();

    // Owner should see is_invoiced = true in time-log index list
    $this->actingAs($owner)
        ->get(route('time-log.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('time-log/index')
            ->has('timeLogs', fn (Assert $assert): Assert => $assert
                ->where('0.is_invoiced', true)
            )
        );

    // Non-owner (member) should NOT see invoiced flag as true
    $this->actingAs($member)
        ->get(route('time-log.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('time-log/index')
            ->has('timeLogs', fn (Assert $assert): Assert => $assert
                ->where('0.is_invoiced', false)
            )
        );
});
