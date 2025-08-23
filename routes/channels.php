<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', fn ($user, $id): bool => (int) $user->id === (int) $id);

// Presence channel to track online users across the app
Broadcast::channel('online', fn ($user): array => [
    'id' => (int) $user->id,
    'name' => (string) $user->name,
    'email' => (string) $user->email,
    'avatar' => $user->avatar ?? null,
]);
