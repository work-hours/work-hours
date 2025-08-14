<?php

declare(strict_types=1);

use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    Route::get('client', [ClientController::class, 'index'])->name('client.index');
    Route::get('client/create', [ClientController::class, 'create'])->name('client.create');
    Route::get('client/{client}/edit', [ClientController::class, 'edit'])->name('client.edit');
    Route::get('client/{client}/projects', [ClientController::class, 'projects'])->name('client.projects');
});
