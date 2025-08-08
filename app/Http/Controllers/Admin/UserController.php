<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class UserController extends Controller
{
    /**
     * Display a listing of all users.
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'email_verified_at', 'currency', 'created_at'])
            ->with('projects')
            ->withCount(['clients', 'projects', 'timeLogs'])
            ->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        foreach ($users as $user) {
            $teamLeader = [];
            if ($user->projects->isNotEmpty()) {
                foreach ($user->projects as $project) {
                    $tl = User::teamLeader($project);
                    if ($tl->getKey() === $user->getKey()) {
                        continue;
                    }

                    $teamLeader[] = $tl ? $tl->name : '';
                }
            }

            $user->team_leader = $teamLeader;
        }

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }
}
