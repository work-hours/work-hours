<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Throwable;

class TeamController extends Controller
{
    public function index()
    {
        $teamMembers = Team::query()
            ->where('user_id', auth()->id())
            ->with('member')
            ->get()
            ->map(function ($team) {
                return [
                    'id' => $team->member->id,
                    'name' => $team->member->name,
                    'email' => $team->member->email,
                    'role' => $team->member->role ?? 'Member',
                ];
            });

        return Inertia::render('team/index', [
            'teamMembers' => $teamMembers,
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'team.store', middleware: ['auth', 'verified'])]
    public function store(StoreTeamMemberRequest $request): void
    {
        DB::beginTransaction();
        try {
            $user = User::query()->create($request->validated());
            Team::query()->create(['user_id' => auth()->id(), 'member_id' => $user->getKey()]);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function create()
    {
        return Inertia::render('team/create');
    }

    public function edit(User $user)
    {
        // Check if the user is a member of the authenticated user's team
        $isTeamMember = Team::query()
            ->where('user_id', auth()->id())
            ->where('member_id', $user->getKey())
            ->exists();

        if (!$isTeamMember) {
            abort(403, 'You can only edit members of your team.');
        }

        return Inertia::render('team/edit', [
            'user' => $user,
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'team.update', params: ['user'], middleware: ['auth', 'verified'])]
    public function update(UpdateTeamMemberRequest $request, User $user): void
    {
        // Check if the user is a member of the authenticated user's team
        $isTeamMember = Team::query()
            ->where('user_id', auth()->id())
            ->where('member_id', $user->getKey())
            ->exists();

        if (!$isTeamMember) {
            abort(403, 'You can only update members of your team.');
        }

        DB::beginTransaction();
        try {
            $data = $request->validated();

            // Only update password if provided
            if (empty($data['password'])) {
                unset($data['password']);
            } else {
                $data['password'] = Hash::make($data['password']);
            }

            $user->update($data);
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Delete the specified team member.
     *
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'team.destroy', params: ['user'], middleware: ['auth', 'verified'])]
    public function destroy(User $user): void
    {
        // Check if the user is a member of the authenticated user's team
        $isTeamMember = Team::query()
            ->where('user_id', auth()->id())
            ->where('member_id', $user->id)
            ->exists();

        if (!$isTeamMember) {
            abort(403, 'You can only delete members of your team.');
        }

        DB::beginTransaction();
        try {
            // Find and delete the team relationship
            Team::query()->where('member_id', $user->getKey())->where('user_id', auth()->id())->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function timeLogs(User $user)
    {
        // Check if the user is a member of the authenticated user's team
        $isTeamMember = Team::query()
            ->where('user_id', auth()->id())
            ->where('member_id', $user->id)
            ->exists();

        if (!$isTeamMember) {
            abort(403, 'You can only view time logs of members in your team.');
        }

        $query = TimeLog::query()->where('user_id', $user->id);

        // Apply date filters if provided
        if (request()->has('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->has('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        $timeLogs = $query->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                    'duration' => round($timeLog->duration, 2),
                ];
            });

        return Inertia::render('team/time-logs', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
            ],
            'user' => $user,
        ]);
    }
    public function allTimeLogs()
    {
        // Get all team members of the authenticated user
        $teamMembers = Team::query()
            ->where('user_id', auth()->id())
            ->with('member')
            ->get()
            ->pluck('member.id');

        $query = TimeLog::query()->whereIn('user_id', $teamMembers);

        // Apply date filters if provided
        if (request()->has('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->has('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        $timeLogs = $query->with('user')->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'user_name' => $timeLog->user->name,
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                    'duration' => round($timeLog->duration, 2),
                ];
            });

        return Inertia::render('team/all-time-logs', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
            ],
        ]);
    }
}
