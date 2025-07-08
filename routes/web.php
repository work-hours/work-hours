<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Team routes
    Route::get('team', [TeamController::class, 'index'])->name('team.index');
    Route::get('team/create', [TeamController::class, 'create'])->name('team.create');
    Route::get('team/all-time-logs', [TeamController::class, 'allTimeLogs'])->name('team.all-time-logs');
    Route::get('team/{user}/edit', [TeamController::class, 'edit'])->name('team.edit');
    Route::get('team/{user}/time-logs', [TeamController::class, 'timeLogs'])->name('team.time-logs');

    // Time Log routes
    Route::get('time-log', [TimeLogController::class, 'index'])->name('time-log.index');
    Route::get('time-log/create', [TimeLogController::class, 'create'])->name('time-log.create');
    Route::get('time-log/{timeLog}/edit', [TimeLogController::class, 'edit'])->name('time-log.edit');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
