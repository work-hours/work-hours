<?php

declare(strict_types=1);

use App\Http\Controllers\NotificationsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('notifications', [NotificationsController::class, 'index'])->name('notifications.index');
});
