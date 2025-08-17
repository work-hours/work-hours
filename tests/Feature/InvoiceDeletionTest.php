<?php

declare(strict_types=1);

use App\Http\Stores\InvoiceStore;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('disallows deleting an invoice and keeps the record intact', function (): void {
    $user = User::factory()->create();

    // Minimal client for invoice creation
    $client = Client::query()->create([
        'user_id' => $user->id,
        'name' => 'Test Client',
        'email' => 'client@example.com',
    ]);

    // Create a minimal invoice via the store to match domain behavior
    $invoice = InvoiceStore::createInvoice([
        'client_id' => $client->id,
        'invoice_number' => 'INV-TEST-001',
        'issue_date' => now()->toDateString(),
        'due_date' => now()->addDays(7)->toDateString(),
        // no items required for this assertion
    ], $user->id);

    $this->actingAs($user);

    $response = $this->delete(route('invoice.destroy', $invoice));

    $response->assertStatus(405);

    // Ensure the invoice still exists
    $this->assertNotNull(Invoice::query()->find($invoice->id));
});
