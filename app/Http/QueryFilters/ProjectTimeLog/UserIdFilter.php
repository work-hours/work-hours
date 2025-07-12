<?php

namespace App\Http\QueryFilters\ProjectTimeLog;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class UserIdFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($request, Closure $next)
    {
        $builder = $next($request);

        if (request()->get('user_id') && request('user_id')) {
            $builder->where('user_id', request('user_id'));
        }

        return $builder;
    }
}
