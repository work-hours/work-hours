<?php

declare(strict_types=1);

namespace App\Models;

use App\Policies\TeamPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $user_id
 * @property int $member_id
 * @property float $hourly_rate
 * @property string currency
 * @property bool $non_monetary
 * @property User $user
 * @property User $member
 */
#[UsePolicy(TeamPolicy::class)]
final class Team extends Model
{
    protected $fillable = ['user_id', 'member_id', 'hourly_rate', 'currency', 'non_monetary'];

    public static function memberHourlyRate(Project $project, int $memberId): ?float
    {
        if ($project->user_id === $memberId) {
            return (float) $project->user->hourly_rate ?? 0;
        }

        $entry = self::query()->where('user_id', $project->user_id)->where('member_id', $memberId)->first();

        if (!$entry) {
            return 0;
        }

        // Return 0 if the team member is non-monetary
        if ($entry->non_monetary) {
            return 0;
        }

        return (float) $entry->hourly_rate;
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
