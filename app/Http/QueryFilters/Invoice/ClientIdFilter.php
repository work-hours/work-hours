<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Invoice;

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
        if (request()->has('client_id') && request('client_id') !== '' && request('client_id') !== 'null' && request('client_id') !== null) {
            $clientId = request('client_id');
            $builder->where('client_id', $clientId);
        }

        return $next($builder);
    }
}
