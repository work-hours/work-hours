<?php

declare(strict_types=1);

use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('client', [ClientController::class, 'index'])->name('client.index');
    Route::get('client/{client}/projects', [ClientController::class, 'projects'])->name('client.projects');
});
