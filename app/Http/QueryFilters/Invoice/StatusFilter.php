<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Invoice;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class StatusFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('status') && request('status') !== '' && request('status') !== 'null' && request('status') !== null) {
            $status = request('status');
            $builder->where('status', $status);
        }

        return $next($builder);
    }
}
