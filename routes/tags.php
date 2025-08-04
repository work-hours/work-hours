<?php

declare(strict_types=1);

use App\Http\Controllers\TagController;
use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    // Tag routes
    Route::get('/tags', [TagController::class, 'index'])->name('tags.index');
    Route::get('/tags/autocomplete', [TagController::class, 'autocomplete'])->name('tags.autocomplete');
    Route::post('/tags', [TagController::class, 'store'])->name('tags.store');
    Route::put('/tags/{tag}', [TagController::class, 'update'])->name('tags.update');
    Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    // Time log tag routes
    Route::post('/time-log/{timeLog}/tags', [TimeLogController::class, 'attachTags'])->name('time-log.tags.attach');
    Route::get('/time-log/{timeLog}/tags', [TimeLogController::class, 'getTags'])->name('time-log.tags.get');
});
