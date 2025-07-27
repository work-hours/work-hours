<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Class Client
 *
 * @property int $id
 * @property int $user_id
 * @property string $name
 * @property string|null $email
 * @property string|null $contact_person
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User $user
 * @property-read Collection|Project[] $projects
 */
final class Client extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'contact_person',
        'phone',
        'address',
        'notes',
        'hourly_rate',
        'currency',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
