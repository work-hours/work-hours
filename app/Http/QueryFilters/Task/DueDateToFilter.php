<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Task;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class DueDateToFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('due_date_to') && request('due_date_to')) {
            $builder->whereDate('due_date', '<=', request('due_date_to'));
        }

        return $next($builder);
    }
}
