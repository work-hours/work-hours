<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Http\QueryFilters\Client\CreatedDateFromFilter;
use App\Http\QueryFilters\Client\CreatedDateToFilter;
use App\Http\QueryFilters\Client\SearchFilter;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Collection;

final class ClientStore
{
    public static function userClients(int $userId): Collection
    {
        $query = Client::query()
            ->where('user_id', $userId)
            ->orderBy('name');

        return self::applyFilterPipeline($query)->get();
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
            'hourly_rate' => $client->hourly_rate,
            'currency' => $client->currency,
            'created_at' => Carbon::parse($client->created_at)->toDateTimeString(),
        ]);
    }

    public static function filters(): array
    {
        return [
            'search' => request('search', ''),
            'created-date-from' => request('created-date-from', ''),
            'created-date-to' => request('created-date-to', ''),
        ];
    }

    public static function exportHeaders(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Contact Person',
            'Phone',
            'Address',
            'Notes',
            'Hourly Rate',
            'Currency',
            'Created At',
        ];
    }

    private static function applyFilterPipeline(Builder $query): Builder
    {
        return app(Pipeline::class)
            ->send($query)
            ->through([
                CreatedDateFromFilter::class,
                CreatedDateToFilter::class,
                SearchFilter::class,
            ])
            ->thenReturn();
    }
}
