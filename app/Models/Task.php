<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * Class Task
 *
 * @property int $id
 * @property int $project_id
 * @property int $created_by
 * @property string $title
 * @property string|null $description
 * @property string $status
 * @property string $priority
 * @property Carbon|null $due_date
 * @property bool $is_imported
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Project $project
 * @property Collection|User[] $assignees
 * @property TaskMeta|null $meta
 * @property Collection|Tag[] $tags
 * @property Collection|TaskComment[] $comments
 */
final class Task extends Model
{
    protected $fillable = [
        'project_id',
        'created_by',
        'title',
        'description',
        'status',
        'priority',
        'due_date',
        'is_imported',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'task_user')
            ->withTimestamps();
    }

    /**
     * Get the meta information for the task.
     */
    public function meta(): HasOne
    {
        return $this->hasOne(TaskMeta::class);
    }

    /**
     * Get the tags associated with this task.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Comments on this task.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TaskComment::class);
    }

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'is_imported' => 'boolean',
        ];
    }
}
