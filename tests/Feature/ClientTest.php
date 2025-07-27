<?php

declare(strict_types=1);

use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to the login page', function (): void {
    $this->get('/client')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function (): void {
    $this->actingAs($user = User::factory()->create());

    $this->get('/client')->assertOk();
});

it('can create a client', function (): void {
    $this->actingAs($user = User::factory()->create());

    $response = $this->post(route('client.store'), [
        'name' => 'New Client',
        'email' => 'client@example.com',
        'contact_person' => 'John Doe',
        'phone' => '1234567890',
        'address' => '123 Main St',
        'notes' => 'Important client',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('clients', [
        'user_id' => $user->id,
        'name' => 'New Client',
        'email' => 'client@example.com',
    ]);

    // Verify that the client has USD as the default currency
    $client = Client::query()->where('email', 'client@example.com')->first();
    $this->assertEquals('USD', $client->currency);
});

it('can update a client', function (): void {
    $this->actingAs($user = User::factory()->create());

    $this->post(route('client.store'), [
        'name' => 'New Client',
        'email' => 'client@example.com',
        'contact_person' => 'John Doe',
        'phone' => '1234567890',
        'address' => '123 Main St',
        'notes' => 'Important client',
    ]);

    $client = Client::query()->where('email', 'client@example.com')
        ->where('user_id', $user->id)
        ->firstOrFail();

    $response = $this->put(route('client.update', $client), [
        'name' => 'Updated Client',
        'email' => 'updated@example.com',
        'contact_person' => 'Jane Doe',
        'phone' => '9876543210',
        'address' => '456 Another St',
        'notes' => 'Updated notes',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('clients', [
        'id' => $client->id,
        'name' => 'Updated Client',
        'email' => 'updated@example.com',
    ]);

    // Verify that the client still has USD as the currency after update
    $updatedClient = Client::find($client->id);
    $this->assertEquals('USD', $updatedClient->currency);
});

it('can delete a client', function (): void {
    $this->actingAs($user = User::factory()->create());

    $this->post(route('client.store'), [
        'name' => 'New Client',
        'email' => 'client@example.com',
        'contact_person' => 'John Doe',
        'phone' => '1234567890',
        'address' => '123 Main St',
        'notes' => 'Important client',
    ]);

    $client = Client::query()->where('email', 'client@example.com')
        ->where('user_id', $user->id)
        ->firstOrFail();

    $response = $this->delete(route('client.destroy', $client));

    $response->assertStatus(200);

    $this->assertDatabaseMissing('clients', [
        'id' => $client->id,
    ]);
});
