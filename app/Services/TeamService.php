<?php

declare(strict_types=1);

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

final readonly class TeamService
{
    /**
     * Paginate a base Eloquent query and also retrieve the full filtered collection.
     *
     * @return array{0: LengthAwarePaginator, 1: Collection}
     */
    public function paginateWithFull(Builder $baseQuery, int $perPage = 15): array
    {
        $paginated = (clone $baseQuery)
            ->paginate($perPage)
            ->appends(request()->query());

        $allFiltered = (clone $baseQuery)->get();

        return [$paginated, $allFiltered];
    }

    /**
     * Build a CSV filename with the current date using the given prefix.
     */
    public function csvDateFilename(string $prefix): string
    {
        return $prefix . '_' . Carbon::now()->format('Y-m-d') . '.csv';
    }
}
