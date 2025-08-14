<?php

declare(strict_types=1);

namespace App\Http\QueryBuilders\TimeLog;

use App\Http\QueryFilters\TimeLog\EndDateFilter;
use App\Http\QueryFilters\TimeLog\IsPaidFilter;
use App\Http\QueryFilters\TimeLog\ProjectIdFilter;
use App\Http\QueryFilters\TimeLog\StartDateFilter;
use App\Http\QueryFilters\TimeLog\StatusFilter;
use App\Http\QueryFilters\TimeLog\TagFilter;
use App\Http\QueryFilters\TimeLog\UserIdFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pipeline\Pipeline;

final class FilterTimeLogQuery
{
    public static function builder($baseQuery): Builder
    {
        return app(Pipeline::class)
            ->send($baseQuery)
            ->through([
                StartDateFilter::class,
                EndDateFilter::class,
                UserIdFilter::class,
                IsPaidFilter::class,
                ProjectIdFilter::class,
                StatusFilter::class,
                TagFilter::class,
            ])
            ->thenReturn()
            ->with(['user', 'project', 'task', 'tags'])
            ->orderBy('created_at', 'desc');
    }
}
