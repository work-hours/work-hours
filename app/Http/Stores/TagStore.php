<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

final class TagStore
{
    public static function userTags(int|array $userId): Collection
    {
        if (is_array($userId)) {
            return Tag::query()->whereIn('user_id', $userId)->get();
        }

        return Tag::query()->where('user_id', $userId)->get();
    }

    public static function allTags(bool $map = false): Collection|\Illuminate\Support\Collection
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
}
