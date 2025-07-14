<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Adapters\GitHubAdapter;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

final class GitHubAuthController extends Controller
{
    private GitHubAdapter $githubAdapter;

    public function __construct(GitHubAdapter $githubAdapter)
    {
        $this->githubAdapter = $githubAdapter;
    }
    /**
     * Redirect the user to the GitHub authentication page.
     */
    public function redirectToGitHub(): RedirectResponse
    {
        return $this->githubAdapter->redirectToGitHub();
    }

    /**
     * Collect the user information from GitHub.
     */
    public function handleGitHubCallback(): RedirectResponse
    {
        try {
            $result = $this->githubAdapter->handleGitHubCallback();

            // Store the GitHub token in the session
            session(['github_token' => $result['token']]);

            Auth::login($result['user']);

            session()->regenerate();

            return redirect()->intended(route('dashboard', absolute: false));
        } catch (Exception $e) {
            Log::error($e);

            return redirect()->route('login')->with('status', 'GitHub authentication failed. Please try again.');
        }
    }
}
