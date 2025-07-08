<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        // Get team stats for the authenticated user
        $teamCount = Team::query()->where('user_id', auth()->id())->count();

        return inertia('dashboard', [
            'teamStats' => [
                'count' => $teamCount,
            ],
        ]);
    }
}
