<?php

declare(strict_types=1);

use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    Route::get('team', [TeamController::class, 'index'])->name('team.index');
    Route::get('team/create', [TeamController::class, 'create'])->name('team.create');
    Route::get('team/all-time-logs', [TeamController::class, 'allTimeLogs'])->name('team.all-time-logs');
    Route::get('team/{user}/edit', [TeamController::class, 'edit'])->name('team.edit');
    Route::get('team/{user}/time-logs', [TeamController::class, 'timeLogs'])->name('team.time-logs');
});
