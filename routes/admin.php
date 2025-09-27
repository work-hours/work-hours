<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ClientController as AdminClientController;
use App\Http\Controllers\Admin\InvoiceController as AdminInvoiceController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\TaskController as AdminTaskController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::middleware(AdminMiddleware::class)
        ->prefix('administration')
        ->name('admin.')
        ->group(function (): void {
            Route::get('/', [AdminController::class, 'index'])->name('index');
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::get('/projects', (new AdminProjectController())->index(...))->name('projects.index');
            Route::get('/clients', (new AdminClientController())->index(...))->name('clients.index');
            Route::get('/invoices', (new AdminInvoiceController())->index(...))->name('invoices.index');
            Route::get('/tasks', (new AdminTaskController())->index(...))->name('tasks.index');
        });
});
