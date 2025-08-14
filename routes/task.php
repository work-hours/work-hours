<?php

declare(strict_types=1);

use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    Route::get('task', [TaskController::class, 'index'])->name('task.index');
    Route::get('task/create', [TaskController::class, 'create'])->name('task.create');
    Route::get('task/{task}/edit', [TaskController::class, 'edit'])->name('task.edit');
    Route::get('task/{task}', [TaskController::class, 'detail'])->name('task.detail');

    Route::post('task/{task}/comments', [TaskController::class, 'storeComment'])->name('task.comments.store');
    Route::put('task/{task}/comments/{comment}', [TaskController::class, 'updateComment'])->name('task.comments.update');
    Route::delete('task/{task}/comments/{comment}', [TaskController::class, 'destroyComment'])->name('task.comments.destroy');

    Route::delete('task/{task}/attachments/{filename}', [TaskController::class, 'destroyAttachment'])
        ->where('filename', '[^/]+')
        ->name('task.attachments.destroy');
});
