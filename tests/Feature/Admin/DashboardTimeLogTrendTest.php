<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('shows time log entry trend on the admin dashboard', function (): void {
    // Admin user (must be verified to pass verified middleware)
    $admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    config()->set('app.admin_ids', [$admin->id]);

    $this->actingAs($admin)
        ->get(route('admin.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page): Assert => $page
            ->component('Admin/Dashboard')
            ->has('timeLogTrend', 30, fn (Assert $tr): Assert => $tr
                ->has('date')
                ->has('count')
            )
        );
});
