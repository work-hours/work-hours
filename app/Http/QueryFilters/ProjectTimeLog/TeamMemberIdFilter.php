<?php

declare(strict_types=1);

namespace App\Http\QueryFilters\ProjectTimeLog;

use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class TeamMemberIdFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($request, Closure $next)
    {
        $builder = $next($request);

        if (request()->get('team_member_id') && request('team_member_id')) {
            $builder->where('user_id', request('team_member_id'));
        }

        return $builder;
    }
}
