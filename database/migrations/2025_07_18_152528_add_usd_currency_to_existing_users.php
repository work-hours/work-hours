<?php

declare(strict_types=1);

use App\Models\Currency;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            $hasCurrency = Currency::query()->where('user_id', $user->id)->exists();

            if (! $hasCurrency) {
                Currency::query()->create([
                    'user_id' => $user->id,
                    'code' => 'USD',
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove USD currency from users who only have USD as their currency
        // This ensures we don't leave users without any currency
        $usersWithOnlyUsd = User::whereHas('currencies', function ($query) {
            $query->where('code', 'USD');
        })->whereDoesntHave('currencies', function ($query) {
            $query->where('code', '!=', 'USD');
        })->get();

        // For these users, we won't delete their only currency
        // For other users, we can safely delete USD if it was added by this migration
        $usersWithMultipleCurrencies = User::whereHas('currencies', function ($query) {
            $query->where('code', 'USD');
        })->whereHas('currencies', function ($query) {
            $query->where('code', '!=', 'USD');
        })->pluck('id')->toArray();

        if (!empty($usersWithMultipleCurrencies)) {
            Currency::whereIn('user_id', $usersWithMultipleCurrencies)
                ->where('code', 'USD')
                ->delete();
        }
    }
};
