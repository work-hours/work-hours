<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Task;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class DueDateFromFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('due_date_from') && request('due_date_from')) {
            $builder->whereDate('due_date', '>=', request('due_date_from'));
        }

        return $next($builder);
    }
}
