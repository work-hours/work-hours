<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows verified user registration trend on the admin dashboard', function (): void {
    // Admin user (must be verified to pass verified middleware)
    $admin = User::factory()->create([
        'email_verified_at' => Carbon::now(),
    ]);
    config()->set('app.admin_ids', [$admin->id]);

    // Unverified user should not be counted
    User::factory()->create([
        'email_verified_at' => null,
    ]);

    // Verified users within 30 days
    $today = Carbon::today();

    // 2 users today
    User::factory()->count(2)->create([
        'email_verified_at' => $today->copy()->setTime(10, 0),
    ]);

    // 1 user 2 days ago
    User::factory()->create([
        'email_verified_at' => $today->copy()->subDays(2)->setTime(9, 30),
    ]);

    // Verified user 40 days ago (outside window)
    User::factory()->create([
        'email_verified_at' => $today->copy()->subDays(40)->setTime(12, 0),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Dashboard')
            ->has('userRegistrationTrend', 30, fn (Assert $tr): Assert => $tr
                ->has('date')
                ->has('count')
            )
            ->where('userRegistrationTrend.27.count', 1) // 2 days ago (index 27 when 29=today)
            ->where('userRegistrationTrend.29.count', 3) // today includes the admin + 2 created today
        );
});
