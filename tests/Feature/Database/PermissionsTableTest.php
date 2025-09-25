<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schema;

it('has permissions table with required columns', function (): void {
    expect(Schema::hasTable('permissions'))->toBeTrue();

    expect(Schema::hasColumns('permissions', [
        'id',
        'name',
        'slug',
        'description',
        'created_at',
        'updated_at',
    ]))->toBeTrue();
});
