<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $project_id
 * @property int $member_id
 * @property bool $is_approver
 * @property float|null $hourly_rate
 * @property string|null $currency
 */
final class ProjectTeam extends Model
{
    public $timestamps = true;

    protected $table = 'project_team';

    protected $fillable = [
        'project_id',
        'member_id',
        'is_approver',
        'hourly_rate',
        'currency',
    ];
}
