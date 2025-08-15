<?php

declare(strict_types=1);

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the admin clients index for admins', function (): void {
    $user = User::factory()->create();

    // Mark this user as admin
    config()->set('app.admin_ids', [$user->id]);

    $this->actingAs($user)
        ->get(route('admin.clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Clients/Index')
            ->has('clients')
        );
});
