<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public pages
Route::get('/', fn () => Inertia::render('welcome'))->name('home');
Route::get('/pricing', fn () => Inertia::render('pricing'))->name('pricing');

// Feature pages
Route::get('/features/time-tracking', fn () => Inertia::render('features/TimeTracking'))->name('features.time-tracking');
Route::get('/features/detailed-reports', fn () => Inertia::render('features/DetailedReports'))->name('features.detailed-reports');
Route::get('/features/team-collaboration', fn () => Inertia::render('features/TeamCollaboration'))->name('features.team-collaboration');
Route::get('/features/client-management', fn () => Inertia::render('features/ClientManagement'))->name('features.client-management');
Route::get('/features/bulk-upload', fn () => Inertia::render('features/BulkUpload'))->name('features.bulk-upload');
Route::get('/features/approval-management', fn () => Inertia::render('features/ApprovalManagement'))->name('features.approval-management');
Route::get('/features/currency-management', fn () => Inertia::render('features/CurrencyManagement'))->name('features.currency-management');
Route::get('/features/multi-currency-invoice', fn () => Inertia::render('features/MultiCurrencyInvoice'))->name('features.multi-currency-invoice');
Route::get('/features/task-management', fn () => Inertia::render('features/TaskManagement'))->name('features.task-management');
Route::get('/features/github-integration', fn () => Inertia::render('features/GithubIntegration'))->name('features.github-integration');

// Legal pages
Route::get('/privacy-policy', fn () => Inertia::render('legal/PrivacyPolicy'))->name('privacy-policy');
Route::get('/terms-of-service', fn () => Inertia::render('legal/TermsOfService'))->name('terms-of-service');
Route::get('/cookie-policy', fn () => Inertia::render('legal/CookiePolicy'))->name('cookie-policy');
Route::get('/gdpr-compliance', fn () => Inertia::render('legal/GDPRCompliance'))->name('gdpr-compliance');
Route::get('/security', fn () => Inertia::render('legal/Security'))->name('security');
