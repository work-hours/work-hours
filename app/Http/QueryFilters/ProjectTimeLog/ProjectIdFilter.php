<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\ProjectTimeLog;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class ProjectIdFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($request, Closure $next)
    {
        $builder = $next($request);

        if (request()->get('project_id') && request('project_id')) {
            $builder->where('project_id', request('project_id'));
        }

        return $builder;
    }
}
