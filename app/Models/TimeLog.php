<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TimeLog extends Model
{
    protected $fillable = [
        'user_id',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'duration',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'duration' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
