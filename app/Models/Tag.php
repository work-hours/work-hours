<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Carbon;

/**
 * Class Tag
 *
 * @property int $id
 * @property string $name
 * @property int $user_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
final class Tag extends Model
{
    protected $fillable = [
        'name',
        'user_id',
    ];

    /**
     * Get the time logs associated with the tag.
     */
    public function timeLogs(): BelongsToMany
    {
        return $this->belongsToMany(TimeLog::class);
    }

    /**
     * Get the user that owns the tag.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
