<?php

declare(strict_types=1);

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    // Page route removed: chat now opens in an offcanvas component
    Route::post('chat/start', [ChatController::class, 'start'])->name('chat.start');
    Route::post('chat/send', [ChatController::class, 'send'])->name('chat.send');
});
