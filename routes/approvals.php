<?php

declare(strict_types=1);

use App\Http\Controllers\ApprovalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('approvals', [ApprovalController::class, 'index'])->name('approvals.index');
});
