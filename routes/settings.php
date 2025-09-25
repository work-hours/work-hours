<?php

declare(strict_types=1);

use App\Http\Controllers\Settings\CurrencyController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function (): void {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('settings/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('settings/profile/photo', [ProfileController::class, 'destroyPhoto'])->name('profile.photo.destroy');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', fn () => Inertia::render('settings/appearance'))->name('appearance');

    Route::get('settings/currency', [CurrencyController::class, 'edit'])->name('currency.edit');
    Route::post('settings/currency', [CurrencyController::class, 'store'])->name('currency.store');
    Route::delete('settings/currency/{currency}', [CurrencyController::class, 'destroy'])->name('currency.destroy');
});
