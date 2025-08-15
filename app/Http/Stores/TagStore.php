<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Collection as SupportCollection;

final class TagStore
{
    public static function userTags(int|array $userId): Collection
    {
        if (is_array($userId)) {
            return Tag::query()->whereIn('user_id', $userId)->get();
        }

        return Tag::query()->where('user_id', $userId)->get();
    }

    public static function allTags(bool $map = false): Collection|SupportCollection
    {
        $tags = Tag::all();

        if ($map) {
            return $tags->map(fn ($tag): array => [
                'id' => $tag->id,
                'name' => $tag->name,
                'color' => $tag->color,
            ]);
        }

        return $tags;
    }

    public static function projectTags(int $userId, bool $map = false): Collection|SupportCollection
    {
        $projectIds = ProjectStore::userProjects(userId: $userId)->pluck('id');

        if ($projectIds->isEmpty()) {
            return collect();
        }

        $tags = Tag::query()
            ->whereHas('tasks', function ($query) use ($projectIds): void {
                $query->whereIn('project_id', $projectIds);
            })
            ->distinct()
            ->get();

        if ($map) {
            return $tags->map(fn ($tag): array => [
                'id' => $tag->id,
                'name' => $tag->name,
                'color' => $tag->color,
            ]);
        }

        return $tags;
    }
}
