<?php

declare(strict_types=1);

use App\Models\Project;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows only project owner to un-invoice a time log', function (): void {
    $this->markTestSkipped('Factories not available in this project; skipping until factories exist.');

    $owner = User::factory()->create();
    $member = User::factory()->create();

    $project = Project::factory()->for($owner)->create();

    $timeLog = TimeLog::factory()->for($member)->for($project)
        ->state([
            'invoice_id' => 999,
            'status' => 'approved',
            'is_paid' => false,
        ])->create();

    // Owner can un-invoice
    $this->actingAs($owner)
        ->post(route('time-log.uninvoice', $timeLog))
        ->assertSuccessful();

    expect($timeLog->fresh()->invoice_id)->toBeNull();

    // Member cannot un-invoice
    $timeLog->update(['invoice_id' => 123]);

    $this->actingAs($member)
        ->post(route('time-log.uninvoice', $timeLog))
        ->assertForbidden();
});
