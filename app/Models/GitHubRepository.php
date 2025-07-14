<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class GitHubRepository
 *
 * @property int $id
 * @property int $user_id
 * @property int|null $project_id
 * @property string $repo_id
 * @property string $name
 * @property string $full_name
 * @property string|null $description
 * @property string $html_url
 * @property bool $is_private
 * @property bool $is_organization
 * @property string|null $organization_name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User $user
 * @property Project|null $project
 */
final class GitHubRepository extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'repo_id',
        'name',
        'full_name',
        'description',
        'html_url',
        'is_private',
        'is_organization',
        'organization_name',
    ];

    protected $casts = [
        'is_private' => 'boolean',
        'is_organization' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
