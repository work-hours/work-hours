<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

final class IntegrationController extends Controller
{
    /**
     * Display the integration page.
     */
    public function index(): Response
    {
        // Check if GitHub is integrated by checking if the user has a github_token
        $user = Auth::user();
        $isGitHubIntegrated = !empty($user->github_token);

        return Inertia::render('integration/index', [
            'isGitHubIntegrated' => $isGitHubIntegrated,
        ]);
    }
}
