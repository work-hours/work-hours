<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Team;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class RestrictEmployeeAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        [$currentPath] = explode('/', mb_ltrim($request->path(), '/'));

        $route = $request->route();
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        $middleware = collect($route->middleware())->map(static fn ($m): string => (string) $m);

        if ($middleware->doesntContain('auth')) {
            return $next($request);
        }

        $isEmployee = Team::query()
            ->where('member_id', $user->getKey())
            ->where('is_employee', true)
            ->exists();

        if (! $isEmployee) {
            return $next($request);
        }

        if ($this->isApiLikeRequest($request)) {
            return $next($request);
        }

        $allowedPaths = [
            'dashboard',
            'project',
            'task',
            'time-log',
        ];

        if ($request->routeIs('logout')) {
            return $next($request);
        }

        if (in_array($currentPath, $allowedPaths, true)) {
            return $next($request);
        }

        abort(403, 'You are not allowed to access this page.');
    }

    private function isApiLikeRequest(Request $request): bool
    {
        if ($request->expectsJson() || $request->wantsJson() || $request->isXmlHttpRequest() || $request->ajax()) {
            return true;
        }

        $path = mb_ltrim($request->path(), '/');

        return str_starts_with($path, 'api') || str_starts_with($path, 'action');
    }
}
