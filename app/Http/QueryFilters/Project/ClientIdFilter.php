<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Project;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class ClientIdFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('client_id') && request('client_id') !== '') {
            $builder->where('client_id', request('client_id'));
        }

        return $next($builder);
    }
}
