<?php

declare(strict_types=1);

use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

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
        expect($point['userHours'])->toBeFloat();
        expect($point['teamHours'])->toBeFloat();
    }
});
