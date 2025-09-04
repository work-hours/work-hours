<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\Task;

use Carbon\Carbon;
use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class DueTodayFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('due-today')) {
            $value = request('due-today');
            $truthy = in_array($value, [1, '1', true, 'true', 'on'], true);

            if ($truthy) {
                $builder->whereDate('due_date', '=', Carbon::today());
            }
        }

        return $next($builder);
    }
}
