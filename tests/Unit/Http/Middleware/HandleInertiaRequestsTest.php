<?php

declare(strict_types=1);

use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;

uses(RefreshDatabase::class);

it('shares memberIds when user is a team leader', function (): void {
    $leader = User::factory()->create();
    $memberA = User::factory()->create();
    $memberB = User::factory()->create();

    Team::query()->create(['user_id' => $leader->id, 'member_id' => $memberA->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);
    Team::query()->create(['user_id' => $leader->id, 'member_id' => $memberB->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);

    $request = Request::create('/');
    $request->setUserResolver(fn () => $leader);

    $middleware = app(HandleInertiaRequests::class);
    $shared = $middleware->share($request);

    expect($shared)
        ->toHaveKey('teamContext')
        ->and($shared['teamContext']['leaderIds'])
        ->toBeArray()
        ->toBeEmpty()
        ->and($shared['teamContext']['memberIds'])
        ->toBeArray()
        ->toContain($memberA->id, $memberB->id);
});

it('shares leaderIds when user is a team member (supports multiple)', function (): void {
    $leaderA = User::factory()->create();
    $leaderB = User::factory()->create();
    $member = User::factory()->create();

    Team::query()->create(['user_id' => $leaderA->id, 'member_id' => $member->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);
    Team::query()->create(['user_id' => $leaderB->id, 'member_id' => $member->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);

    $request = Request::create('/');
    $request->setUserResolver(fn () => $member);

    $middleware = app(HandleInertiaRequests::class);
    $shared = $middleware->share($request);

    expect($shared)
        ->toHaveKey('teamContext')
        ->and($shared['teamContext']['leaderIds'])
        ->toBeArray()
        ->toContain($leaderA->id, $leaderB->id)
        ->and($shared['teamContext']['memberIds'])
        ->toBeArray()
        ->toBeEmpty();
});

it('shares both leaderIds and memberIds when user is both leader and member', function (): void {
    $user = User::factory()->create();

    $memberX = User::factory()->create();
    $memberY = User::factory()->create();

    $leaderA = User::factory()->create();
    $leaderB = User::factory()->create();

    // As leader
    Team::query()->create(['user_id' => $user->id, 'member_id' => $memberX->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);
    Team::query()->create(['user_id' => $user->id, 'member_id' => $memberY->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);

    // As member
    Team::query()->create(['user_id' => $leaderA->id, 'member_id' => $user->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);
    Team::query()->create(['user_id' => $leaderB->id, 'member_id' => $user->id, 'hourly_rate' => 0, 'currency' => 'USD', 'non_monetary' => false]);

    $request = Request::create('/');
    $request->setUserResolver(fn () => $user);

    $middleware = app(HandleInertiaRequests::class);
    $shared = $middleware->share($request);

    expect($shared)
        ->toHaveKey('teamContext')
        ->and($shared['teamContext']['leaderIds'])
        ->toBeArray()
        ->toContain($leaderA->id, $leaderB->id)
        ->and($shared['teamContext']['memberIds'])
        ->toBeArray()
        ->toContain($memberX->id, $memberY->id);
});
