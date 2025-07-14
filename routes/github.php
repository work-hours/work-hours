<?php

declare(strict_types=1);

use App\Http\Controllers\GitHubRepositoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function (): void {
    // GitHub Repository Routes
    Route::get('github/repositories', [GitHubRepositoryController::class, 'index'])
        ->name('github.repositories');

    Route::get('github/repositories/personal', [GitHubRepositoryController::class, 'getPersonalRepositories'])
        ->name('github.repositories.personal');

    Route::get('github/repositories/organization', [GitHubRepositoryController::class, 'getOrganizationRepositories'])
        ->name('github.repositories.organization');

});
