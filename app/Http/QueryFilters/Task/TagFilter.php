<?php
declare(strict_types=1);
namespace App\Http\QueryFilters\Task;
use Closure;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
final class TagFilter
{
    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function handle($builder, Closure $next)
    {
        if (request()->has('tag_id') && request('tag_id') !== 'all') {
            $builder->whereHas('tags', function ($query) {
                $query->where('tags.id', request('tag_id'));
            });
        }
        return $next($builder);
    }
}
