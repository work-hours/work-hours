<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schema;

it('has teams table with created_by column', function (): void {
    expect(Schema::hasTable('teams'))->toBeTrue();

    expect(Schema::hasColumns('teams', [
        'id',
        'user_id',
        'member_id',
        'hourly_rate',
        'currency',
        'created_by',
        'created_at',
        'updated_at',
    ]))->toBeTrue();
});
