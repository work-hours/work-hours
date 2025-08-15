<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ClientController as AdminClientController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    Route::middleware(AdminMiddleware::class)
        ->prefix('administration')
        ->name('admin.')
        ->group(function (): void {
            Route::get('/', [AdminController::class, 'index'])->name('index');
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::get('/projects', [AdminProjectController::class, 'index'])->name('projects.index');
            Route::get('/clients', [AdminClientController::class, 'index'])->name('clients.index');
        });
});
