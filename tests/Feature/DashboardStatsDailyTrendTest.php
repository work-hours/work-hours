<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

uses(RefreshDatabase::class);

it('returns daily trend with 7 days for authenticated verified user', function (): void {
    $user = User::factory()->create();

    actingAs($user);

    $response = getJson(route('dashboard.stats'));

    $response->assertSuccessful();

    $response->assertJsonStructure([
        'count',
        'totalHours',
        'unpaidHours',
        'unpaidAmountsByCurrency',
        'paidAmountsByCurrency',
        'currency',
        'weeklyAverage',
        'clientCount',
        'dailyTrend',
    ]);

    $data = $response->json();

    expect($data['dailyTrend'])->toBeArray();
    expect(count($data['dailyTrend']))->toBe(7);

    foreach ($data['dailyTrend'] as $point) {
        expect($point)->toHaveKeys(['date', 'userHours', 'teamHours']);
        expect(is_numeric($point['userHours']))->toBeTrue();
        expect(is_numeric($point['teamHours']))->toBeTrue();
        expect($point['userHours'])->toBeGreaterThanOrEqual(0);
        expect($point['teamHours'])->toBeGreaterThanOrEqual(0);
    }
});

it('returns daily trend for a custom date range', function (): void {
    $user = User::factory()->create();
    actingAs($user);

    $start = Carbon::parse('2025-01-01');
    $end = Carbon::parse('2025-01-05');

    $response = getJson(route('dashboard.stats', [
        'start-date' => $start->toDateString(),
        'end-date' => $end->toDateString(),
    ]));

    $response->assertSuccessful();

    $data = $response->json();
    expect($data['dailyTrend'])->toBeArray();
    expect(count($data['dailyTrend']))->toBe(5);
});
