<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Task;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class PriorityFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('priority') && request('priority') !== 'all') {
            $builder->where('priority', request('priority'));
        }

        return $next($builder);
    }
}
