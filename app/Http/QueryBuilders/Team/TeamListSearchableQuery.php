<?php

declare(strict_types=1);

namespace App\Http\QueryBuilders\Team;

use App\Models\Team;
use Illuminate\Database\Eloquent\Builder;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

final class TeamListSearchableQuery
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public static function builder(): Builder
    {
        return Team::query()
            ->where('user_id', auth()->id())
            ->with(['member', 'member.permissions'])
            ->when(request()->get('search'), function ($query): void {
                $search = request('search');
                $query->whereHas('member', function ($q) use ($search): void {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            });
    }
}
