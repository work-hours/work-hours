<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Invoice;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class SearchFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('search') && request('search') !== '' && request('search') !== 'null' && request('search') !== null) {
            $search = request('search');
            $builder->where(function ($query) use ($search): void {
                $query->where('invoice_number', 'like', "%{$search}%");
            });
        }

        return $next($builder);
    }
}
