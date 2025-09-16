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
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        $isEmployee = Team::query()
            ->where('member_id', $user->getKey())
            ->where('is_employee', true)
            ->exists();

        if (! $isEmployee) {
            return $next($request);
        }

        // Allow-list for employees: only sidebar sections and their supporting endpoints
        $path = '/' . mb_ltrim($request->path(), '/');

        $allowedPrefixes = [
            '/dashboard',
            '/project',
            '/task',
            '/time-log',
        ];

        // Always allow logout so employees can sign out
        if ($request->routeIs('logout')) {
            return $next($request);
        }

        foreach ($allowedPrefixes as $prefix) {
            if (str_starts_with($path, $prefix)) {
                return $next($request);
            }
        }

        // For disallowed URLs, forbid access
        abort(403, 'You are not allowed to access this page.');
    }
}
