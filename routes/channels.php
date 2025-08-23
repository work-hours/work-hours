<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);

// Presence channel to track online users across the app
Broadcast::channel('online', function ($user): array {
    return [
        'id' => (int) $user->id,
        'name' => (string) $user->name,
        'email' => (string) $user->email,
        // avatar is optional in our frontend types; include if available
        'avatar' => $user->avatar ?? null,
    ];
});
