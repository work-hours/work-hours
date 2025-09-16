<?php

declare(strict_types=1);

use App\Models\Expense;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

it('can create an expense with receipt', function (): void {
    Storage::fake('public');

    $this->actingAs(User::factory()->create());

    $file = UploadedFile::fake()->image('receipt.png');

    $response = $this->post(route('expense.store'), [
        'title' => 'Lunch Meeting',
        'description' => 'Client lunch meeting',
        'amount' => 25.50,
        'currency' => 'USD',
        'receipt' => $file,
    ]);

    $response->assertSuccessful();

    $this->assertDatabaseHas('expenses', [
        'title' => 'Lunch Meeting',
        'description' => 'Client lunch meeting',
    ]);

    $expense = Expense::query()->firstOrFail();
    Storage::disk('public')->assertExists($expense->receipt_path);
});

it('lists only the authenticated user\'s expenses', function (): void {
    $user = User::factory()->create();
    $other = User::factory()->create();

    Expense::factory()->create(['user_id' => $user->id, 'title' => 'Mine', 'description' => 'd', 'amount' => 10, 'currency' => 'USD', 'receipt_path' => 'receipts/a.png']);
    Expense::factory()->create(['user_id' => $other->id, 'title' => 'Not Mine', 'description' => 'd', 'amount' => 20, 'currency' => 'USD', 'receipt_path' => 'receipts/b.png']);

    $this->actingAs($user);

    $response = $this->get(route('expenses', ['search' => '']))->assertSuccessful();

    $data = $response->json();
    expect(collect($data)->pluck('title'))->toContain('Mine')->not->toContain('Not Mine');
});

it('can update an expense and optionally replace receipt', function (): void {
    Storage::fake('public');

    $user = User::factory()->create();
    $this->actingAs($user);

    $initial = UploadedFile::fake()->image('initial.png');
    $path = $initial->store('receipts', 'public');

    $expense = Expense::factory()->create([
        'user_id' => $user->id,
        'title' => 'Taxi',
        'description' => 'Airport taxi',
        'amount' => 50,
        'currency' => 'USD',
        'receipt_path' => $path,
    ]);

    $response = $this->put(route('expense.update', $expense), [
        'title' => 'Taxi Ride',
        'description' => 'Airport taxi updated',
        'amount' => 55,
        'currency' => 'USD',
    ]);

    $response->assertSuccessful();

    $this->assertDatabaseHas('expenses', [
        'id' => $expense->id,
        'title' => 'Taxi Ride',
        'description' => 'Airport taxi updated',
    ]);

    // replace receipt
    $newFile = UploadedFile::fake()->image('new.png');

    $response = $this->put(route('expense.update', $expense), [
        'title' => 'Taxi Ride',
        'description' => 'Airport taxi updated',
        'amount' => 60,
        'currency' => 'USD',
        'receipt' => $newFile,
    ]);

    $response->assertSuccessful();

    $expense->refresh();
    Storage::disk('public')->assertExists($expense->receipt_path);
});
