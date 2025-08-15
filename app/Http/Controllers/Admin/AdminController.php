<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        $userCount = User::query()->count();
        $timeLogCount = TimeLog::query()->count();
        $projectCount = Project::query()->count();
        $clientCount = Client::query()->count();
        $invoiceCount = Invoice::query()->count();

        return Inertia::render('Admin/Dashboard', [
            'userCount' => $userCount,
            'timeLogCount' => $timeLogCount,
            'projectCount' => $projectCount,
            'clientCount' => $clientCount,
            'invoiceCount' => $invoiceCount,
        ]);
    }
}
