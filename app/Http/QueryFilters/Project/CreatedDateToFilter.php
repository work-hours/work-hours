<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Project;

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
            $builder->whereDate('created_at', '<=', request('created_date_to'));
        }

        return $next($builder);
    }
}
