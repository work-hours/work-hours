<?php

declare(strict_types=1);

use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    Route::get('time-log', [TimeLogController::class, 'index'])->name('time-log.index');
    Route::get('time-log/create', [TimeLogController::class, 'create'])->name('time-log.create');
    Route::get('time-log/{timeLog}/edit', [TimeLogController::class, 'edit'])->name('time-log.edit');
});
