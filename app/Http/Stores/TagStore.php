<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

final class TagStore
{
    public static function userTags(int $userId): Collection
    {
        return Tag::query()->where('user_id', $userId)->get();
    }
}
