<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class TimeLog extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'start_timestamp',
        'end_timestamp',
        'duration',
        'is_paid',
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
        ];
    }
}
