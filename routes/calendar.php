<?php

declare(strict_types=1);

use App\Http\Controllers\CalendarController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('calendar', [CalendarController::class, 'index'])->name('calendar.index');
    Route::get('calendar/detail/{id}', [CalendarController::class, 'detail'])->name('calendar.detail');
});
