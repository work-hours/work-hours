<?php

declare(strict_types=1);

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Team routes
    Route::get('team', [TeamController::class, 'index'])->name('team.index');
    Route::get('team/create', [TeamController::class, 'create'])->name('team.create');
    Route::get('team/all-time-logs', [TeamController::class, 'allTimeLogs'])->name('team.all-time-logs');
    Route::get('team/{user}/edit', [TeamController::class, 'edit'])->name('team.edit');
    Route::get('team/{user}/time-logs', [TeamController::class, 'timeLogs'])->name('team.time-logs');

    // Project routes
    Route::get('project', [ProjectController::class, 'index'])->name('project.index');
    Route::get('project/create', [ProjectController::class, 'create'])->name('project.create');
    Route::get('project/{project}/edit', [ProjectController::class, 'edit'])->name('project.edit');
    Route::get('project/{project}/time-logs', [ProjectController::class, 'timeLogs'])->name('project.time-logs');
    Route::get('project/export-time-logs', [ProjectController::class, 'exportTimeLogs'])->name('project.export-time-logs');

    // Time Log routes
    Route::get('time-log', [TimeLogController::class, 'index'])->name('time-log.index');
    Route::get('time-log/create', [TimeLogController::class, 'create'])->name('time-log.create');
    Route::get('time-log/{timeLog}/edit', [TimeLogController::class, 'edit'])->name('time-log.edit');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
