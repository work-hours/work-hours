<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $user_id
 * @property int $member_id
 * @property float $hourly_rate
 * @property string currency
 * @property User $user
 * @property User $member
 */
final class Team extends Model
{
    protected $fillable = ['user_id', 'member_id'];

    public static function memberHourlyRate(Project $project, int $memberId): ?float
    {
        $entry = self::query()->where('user_id', $project->user_id)->where('member_id', $memberId)->first();

        return $entry ? (float) $entry->hourly_rate : 0;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(User::class, 'member_id');
    }
}
