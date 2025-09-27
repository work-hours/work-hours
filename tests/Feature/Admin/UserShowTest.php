<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('allows admin to view user detail page', function (): void {
    $admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $target = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    Config::set('app.admin_ids', [$admin->id]);

    $this->actingAs($admin);

    $response = $this->get(route('admin.users.show', $target));

    $response->assertSuccessful();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Admin/Users/Show')
        ->has('user', fn (Assert $user) => $user
            ->where('id', $target->id)
            ->where('name', $target->name)
            ->etc()
        )
        ->hasAll(['recent.projects', 'recent.clients', 'recent.assignedTasks', 'recent.timeLogs', 'recent.invoices'])
    );
});
