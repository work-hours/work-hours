<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('allows admin to view the admin time logs index page', function (): void {
    $admin = User::factory()->create();

    // Make this user an admin
    config()->set('app.admin_ids', [$admin->id]);

    $this->actingAs($admin)
        ->get('/administration/time-logs')
        ->assertSuccessful();
});
