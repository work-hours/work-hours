<?php

declare(strict_types=1);

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectNoteController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->middleware('verified')->group(function (): void {
    Route::get('project', [ProjectController::class, 'index'])->name('project.index');
    Route::get('project/create', [ProjectController::class, 'create'])->name('project.create');
    Route::get('project/{project}/edit', [ProjectController::class, 'edit'])->name('project.edit');
    Route::get('project/{project}/time-logs', [ProjectController::class, 'timeLogs'])->name('project.time-logs');

    // Project Notes
    Route::get('project/{project}/notes', [ProjectNoteController::class, 'index'])->name('project.notes');
    Route::post('project/{project}/notes', [ProjectNoteController::class, 'store'])->name('project.notes.store');
    Route::put('project/{project}/notes/{note}', [ProjectNoteController::class, 'update'])->name('project.notes.update');
    Route::delete('project/{project}/notes/{note}', [ProjectNoteController::class, 'destroy'])->name('project.notes.destroy');
});
