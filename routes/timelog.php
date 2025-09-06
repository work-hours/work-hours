<?php

declare(strict_types=1);

use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    Route::get('time-log', [TimeLogController::class, 'index'])->name('time-log.index');
    Route::get('time-log/approvals', [TimeLogController::class, 'approvals'])->name('time-log.approvals');
});
