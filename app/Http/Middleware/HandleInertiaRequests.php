<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Http\Stores\TeamStore;
use App\Models\Message;
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

        $unreadChatUsersCount = 0;
        if ($user) {
            $unreadChatUsersCount = Message::query()
                ->whereNull('read_at')
                ->where('user_id', '!=', $user->id)
                ->whereHas('conversation.participants', static function ($q) use ($user): void {
                    $q->where('users.id', $user->id);
                })
                ->distinct('user_id')
                ->count('user_id');
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => mb_trim((string) $message), 'author' => mb_trim((string) $author)],
            'auth' => [
                'user' => $user,
            ],
            'teamContext' => $teamContext,
            'unreadChatUsersCount' => $unreadChatUsersCount,
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
