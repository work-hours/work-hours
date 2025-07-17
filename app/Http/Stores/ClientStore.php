<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Support\Collection;

final class ClientStore
{
    public static function userClients(int $userId): Collection
    {
        return Client::query()
            ->where('user_id', $userId)
            ->orderBy('name')
            ->get();
    }

    public static function clientProjects(Client $client): Collection
    {
        return $client->projects()
            ->with(['user', 'teamMembers'])
            ->get();
    }

    public static function clientExportMapper(Collection $clients): Collection
    {
        return $clients->map(fn ($client): array => [
            'id' => $client->id,
            'name' => $client->name,
            'email' => $client->email,
            'contact_person' => $client->contact_person,
            'phone' => $client->phone,
            'address' => $client->address,
            'notes' => $client->notes,
            'created_at' => Carbon::parse($client->created_at)->toDateTimeString(),
        ]);
    }
}
