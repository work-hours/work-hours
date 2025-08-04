<?php

use App\Http\Controllers\TagController;
use App\Http\Controllers\TimeLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Tag routes
    Route::get('/tags/autocomplete', [TagController::class, 'autocomplete'])->name('tags.autocomplete');
    Route::post('/tags', [TagController::class, 'store'])->name('tags.store');

    // Time log tag routes
    Route::post('/time-log/{timeLog}/tags', [TimeLogController::class, 'attachTags'])->name('time-log.tags.attach');
    Route::get('/time-log/{timeLog}/tags', [TimeLogController::class, 'getTags'])->name('time-log.tags.get');
});
