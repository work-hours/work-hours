<?php

declare(strict_types=1);

namespace App\Models;

use App\Policies\TimeLogPolicy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class TimeLog
 *
 * @property int $id
 * @property int $user_id
 * @property int $project_id
 * @property Carbon $start_timestamp
 * @property Carbon $end_timestamp
 * @property float $duration
 * @property bool $is_paid
 * @property float $hourly_rate
 * @property string $currency
 * @property string $note
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Project $project
 */
#[UsePolicy(TimeLogPolicy::class)]
final class TimeLog extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'start_timestamp',
        'end_timestamp',
        'duration',
        'is_paid',
        'hourly_rate',
        'note',
        'currency',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    protected function casts(): array
    {
        return [
            'start_timestamp' => 'datetime',
            'end_timestamp' => 'datetime',
            'duration' => 'float',
            'is_paid' => 'boolean',
            'hourly_rate' => 'decimal:2',
            'currency' => 'string',
        ];
    }
}
