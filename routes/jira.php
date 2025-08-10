<?php

declare(strict_types=1);

use App\Http\Controllers\JiraController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    Route::get('jira/connect', [JiraController::class, 'connect'])->name('jira.connect');
    Route::get('jira/projects', [JiraController::class, 'index'])->name('jira.projects');
    Route::post('jira/credentials', [JiraController::class, 'storeCredentials'])->name('jira.credentials.store');
    Route::get('jira/projects/list', [JiraController::class, 'getProjects'])->name('jira.projects.list');
    Route::post('jira/projects/import', [JiraController::class, 'importProject'])->name('jira.projects.import');
});
