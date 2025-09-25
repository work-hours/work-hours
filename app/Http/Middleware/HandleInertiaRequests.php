<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Http\Stores\PermissionStore;
use App\Http\Stores\TeamStore;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Override;
use Tighten\Ziggy\Ziggy;

final class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function __construct() {}

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    #[Override]
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    #[Override]
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $user = $request->user();
        $teamContext = $user ? TeamStore::getContextFor($user) : null;
        $employeeLeaderId = $user ? TeamStore::employeeLeaderIdFor($user->getKey()) : null;
        $isEmployee = $user !== null && $employeeLeaderId !== null;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => mb_trim((string) $message), 'author' => mb_trim((string) $author)],
            'auth' => [
                'user' => $user,
            ],
            'teamContext' => $teamContext,
            'isEmployee' => $isEmployee,
            'myTeamPermissions' => $user ? PermissionStore::userTeamPermissionNames($user) : [],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'isGitHubIntegrated' => $user && ! empty($user->github_token),
            'isJiraIntegrated' => $user && $user->isJiraIntegrated(),
        ];
    }
}
