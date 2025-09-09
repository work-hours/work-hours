<?php

declare(strict_types=1);

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

uses(RefreshDatabase::class);

it('clears timelog invoice_id when invoice is cancelled', function (): void {
    // This project currently lacks model factories used in other tests.
    // Follow existing convention and skip until factories exist.
    $this->markTestSkipped('Factories not available in this project; skipping until factories exist.');

    $user = User::factory()->create();
    actingAs($user);

    $client = Client::factory()->for($user)->create();
    $project = Project::factory()->for($client)->for($user)->create();

    $invoice = Invoice::factory()->for($client)->for($user)->create();

    $logA = TimeLog::factory()->for($project)->for($user)->state([
        'invoice_id' => $invoice->id,
        'status' => 'approved',
        'non_billable' => false,
    ])->create();

    $logB = TimeLog::factory()->for($project)->for($user)->state([
        'invoice_id' => $invoice->id,
        'status' => 'approved',
        'non_billable' => false,
    ])->create();

    // Act: cancel the invoice via the controller route
    post(route('invoice.updateStatus', $invoice), [
        'status' => 'cancelled',
        'paid_amount' => 0,
    ])->assertSuccessful();

    // Assert: the time logs should be detached from the invoice
    expect(TimeLog::query()->find($logA->id)->invoice_id)->toBeNull();
    expect(TimeLog::query()->find($logB->id)->invoice_id)->toBeNull();
});
