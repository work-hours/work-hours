<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\TimeLog;

use App\Enums\TimeLogStatus;
use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class StatusFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($request, Closure $next)
    {
        $builder = $next($request);

        if (request()->get('status') && request('status') !== '') {
            $status = request('status');

            if (in_array($status, TimeLogStatus::values(), true)) {
                $timeLogStatus = TimeLogStatus::fromValue($status);
                $builder->where('status', $timeLogStatus);
            }
        }

        return $builder;
    }
}
