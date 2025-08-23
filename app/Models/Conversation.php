<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

final class Conversation extends Model
{
    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'is_group',
        'title',
    ];

    /**
     * @return BelongsToMany<User>
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->withTimestamps();
    }

    /**
     * @return HasMany<Message>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class)->latest('id');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_group' => 'boolean',
        ];
    }
}
