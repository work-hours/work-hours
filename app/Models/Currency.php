<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

final class Currency extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'code',
    ];

    /**
     * Get the user that owns the currency.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
