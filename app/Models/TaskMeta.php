<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class TaskMeta
 *
 * @property int $id
 * @property int $task_id
 * @property string|null $source
 * @property string|null $source_id
 * @property string|null $source_number
 * @property string|null $source_url
 * @property string|null $source_state
 * @property array|null $extra_data
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property Task $task
 */
final class TaskMeta extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'tasks_meta';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'task_id',
        'source',
        'source_id',
        'source_number',
        'source_url',
        'source_state',
        'extra_data',
    ];

    /**
     * Get the task that the meta belongs to.
     */
    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'extra_data' => 'array',
        ];
    }
}
