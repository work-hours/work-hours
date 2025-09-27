<?php

declare(strict_types=1);

use App\Models\User;

it('generates gravatar url even when email attribute is not loaded', function (): void {
    $user = new User();
    $user->forceFill([
        'id' => 1,
        'name' => 'Test User',
        // intentionally no email
    ]);

    $array = $user->toArray();

    expect($array)
        ->toHaveKey('profile_photo_url')
        ->and($array['profile_photo_url'])
        ->toStartWith('https://www.gravatar.com/avatar/');
});

it('uses storage asset url when profile photo path exists', function (): void {
    $user = new User();
    $user->forceFill([
        'id' => 2,
        'name' => 'Jane',
        'profile_photo_path' => 'avatars/jane.jpg',
    ]);

    expect($user->profile_photo_url)
        ->toContain('/storage/avatars/jane.jpg');
});
