<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Task;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class ProjectIdFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('project_id') && request('project_id') !== 'all') {
            $builder->where('project_id', request('project_id'));
        }

        return $next($builder);
    }
}
