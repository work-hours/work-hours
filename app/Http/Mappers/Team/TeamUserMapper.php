<?php

declare(strict_types=1);

namespace App\Http\Mappers\Team;

use App\Models\Team;
use App\Models\User;

final class TeamUserMapper
{
    public static function map(User $user, Team $team): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'hourly_rate' => $team->hourly_rate,
            'currency' => $team->currency,
            'non_monetary' => (bool) $team->non_monetary,
        ];
    }
}
