<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Invoice;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class CreatedDateToFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('created_date_to') && request('created_date_to') !== '' && request('created_date_to') !== 'null' && request('created_date_to') !== null) {
            $dateTo = request('created_date_to');
            $builder->whereDate('created_at', '<=', $dateTo);
        }

        return $next($builder);
    }
}
