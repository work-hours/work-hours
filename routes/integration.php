<?php

declare(strict_types=1);

use App\Http\Controllers\IntegrationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('integration', [IntegrationController::class, 'index'])->name('integration.index');
});
