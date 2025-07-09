<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Msamgan\Lact\Attributes\Action;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Throwable;

class TeamController extends Controller
{
    use ExportableTrait;
    /**
     * Get projects created by or assigned to the current user
     */
    private function getUserProjects()
    {
        $userId = auth()->id();

        return \App\Models\Project::where('user_id', $userId)
            ->orWhereHas('teamMembers', function ($query) use ($userId) {
                $query->where('member_id', $userId);
            })
            ->get(['id', 'name']);
    }
    public function index()
    {
        $query = Team::query()
            ->where('user_id', auth()->id())
            ->with('member');

        // Apply search filter if provided
        if (request()->get('search')) {
            $search = request('search');
            $query->whereHas('member', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $teamMembers = $query->get()
            ->map(function ($team) {
                // Get time logs for this team member
                $query = TimeLog::query()->where('user_id', $team->member->id);

                // Apply date filters if provided
                if (request()->get('start_date')) {
                    $query->whereDate('start_timestamp', '>=', request('start_date'));
                }

                if (request()->get('end_date')) {
                    $query->whereDate('start_timestamp', '<=', request('end_date'));
                }

                $timeLogs = $query->get();

                // Calculate total hours
                $totalDuration = round($timeLogs->sum('duration'), 2);

                // Calculate weekly average
                $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

                return [
                    'id' => $team->member->id,
                    'name' => $team->member->name,
                    'email' => $team->member->email,
                    'hourly_rate' => $team->hourly_rate,
                    'currency' => $team->currency,
                    'totalHours' => $totalDuration,
                    'weeklyAverage' => $weeklyAverage,
                ];
            });

        return Inertia::render('team/index', [
            'teamMembers' => $teamMembers,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
                'search' => request('search', ''),
            ],
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

            $user = User::query()->where('email', $request->email)->first();

            if (!$user) {
                $userData = $request->safe()->except(['hourly_rate', 'currency']);
                $user = User::query()->create($userData);
            }

            $teamData = [
                'user_id' => auth()->id(),
                'member_id' => $user->getKey(),
                'hourly_rate' => $request->get('hourly_rate') ?? 0,
                'currency' => strtoupper($request->get('currency')) ?? 'USD'
            ];

            Team::query()->create($teamData);

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
        $team = Team::query()
            ->where('user_id', auth()->id())
            ->where('member_id', $user->getKey())
            ->first();

        if (!$team) {
            abort(403, 'You can only edit members of your team.');
        }

        return Inertia::render('team/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'hourly_rate' => $team->hourly_rate,
                'currency' => $team->currency,
            ],
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

            // Extract team-related fields
            $teamData = [
                'hourly_rate' => $data['hourly_rate'] ?? 0,
                'currency' => $data['currency'] ?? 'USD'
            ];
            unset($data['hourly_rate'], $data['currency']);

            // Update user data
            $user->update($data);

            // Update team data
            Team::query()
                ->where('user_id', auth()->id())
                ->where('member_id', $user->getKey())
                ->update($teamData);
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
        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        // Apply project filter if provided
        if (request()->get('project_id') && request('project_id')) {
            // Validate that the project belongs to the logged-in user
            $userProjects = $this->getUserProjects()->pluck('id')->toArray();
            if (in_array(request('project_id'), $userProjects)) {
                $query->where('project_id', request('project_id'));
            }
        }

        // Apply paid/unpaid filter if provided
        if (request()->has('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with('project')->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'project_id' => $timeLog->project_id,
                    'project_name' => $timeLog->project ? $timeLog->project->name : null,
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                    'duration' => round($timeLog->duration, 2),
                    'is_paid' => $timeLog->is_paid,
                ];
            });

        $totalDuration = round($timeLogs->sum('duration'), 2);
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        // Get projects for the dropdown
        $projects = $this->getUserProjects();

        return Inertia::render('team/time-logs', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
                'project_id' => request('project_id', ''),
                'is_paid' => request('is_paid', ''),
            ],
            'projects' => $projects,
            'user' => $user,
            'totalDuration' => $totalDuration,
            'unpaidHours' => $unpaidHours,
            'weeklyAverage' => $weeklyAverage,
        ]);
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function allTimeLogs()
    {
        // Get all team members of the authenticated user
        $teamMembersQuery = Team::query()
            ->where('user_id', auth()->id())
            ->with('member');

        $teamMembersList = $teamMembersQuery->get()
            ->map(function ($team) {
                return [
                    'id' => $team->member->id,
                    'name' => $team->member->name,
                ];
            });

        $teamMemberIds = $teamMembersList->pluck('id');

        $query = TimeLog::query()->whereIn('user_id', $teamMemberIds);

        // Apply date filters if provided
        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        // Apply team member filter if provided
        if (request()->get('team_member_id') && request('team_member_id')) {
            // Validate that the team_member_id belongs to a team member of the authenticated user
            if (!$teamMemberIds->contains(request('team_member_id'))) {
                abort(403, 'You can only view time logs of members in your team.');
            }

            $query->where('user_id', request('team_member_id'));
        }

        // Apply project filter if provided
        if (request()->get('project_id') && request('project_id')) {
            // Validate that the project belongs to the logged-in user
            $userProjects = $this->getUserProjects()->pluck('id')->toArray();
            if (in_array(request('project_id'), $userProjects)) {
                $query->where('project_id', request('project_id'));
            }
        }

        // Apply paid/unpaid filter if provided
        if (request()->has('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with(['user', 'project'])->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'user_name' => $timeLog->user->name,
                    'project_id' => $timeLog->project_id,
                    'project_name' => $timeLog->project ? $timeLog->project->name : null,
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                    'duration' => round($timeLog->duration, 2),
                    'is_paid' => $timeLog->is_paid,
                ];
            });

        $totalDuration = round($timeLogs->sum('duration'), 2);
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        // Get projects for the dropdown
        $projects = $this->getUserProjects();

        return Inertia::render('team/all-time-logs', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
                'team_member_id' => request('team_member_id', ''),
                'project_id' => request('project_id', ''),
                'is_paid' => request('is_paid', ''),
            ],
            'projects' => $projects,
            'teamMembers' => $teamMembersList,
            'totalDuration' => $totalDuration,
            'unpaidHours' => $unpaidHours,
            'weeklyAverage' => $weeklyAverage,
        ]);
    }

    /**
     * Export team members to CSV
     *
     * @return StreamedResponse
     */
    #[Action(method: 'get', name: 'team.export', middleware: ['auth', 'verified'])]
    public function export(): StreamedResponse
    {
        $query = Team::query()
            ->where('user_id', auth()->id())
            ->with('member');

        // Apply search filter if provided
        if (request()->get('search')) {
            $search = request('search');
            $query->whereHas('member', function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $teamMembers = $query->get()
            ->map(function ($team) {
                // Get time logs for this team member
                $query = TimeLog::query()->where('user_id', $team->member->id);

                // Apply date filters if provided
                if (request()->get('start_date')) {
                    $query->whereDate('start_timestamp', '>=', request('start_date'));
                }

                if (request()->get('end_date')) {
                    $query->whereDate('start_timestamp', '<=', request('end_date'));
                }

                $timeLogs = $query->get();

                // Calculate total hours
                $totalDuration = round($timeLogs->sum('duration'), 2);

                // Calculate weekly average
                $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

                return [
                    'id' => $team->member->id,
                    'name' => $team->member->name,
                    'email' => $team->member->email,
                    'hourly_rate' => $team->hourly_rate,
                    'currency' => $team->currency,
                    'total_hours' => $totalDuration,
                    'weekly_average' => $weeklyAverage,
                ];
            });

        $headers = ['ID', 'Name', 'Email', 'Hourly Rate', 'Currency', 'Total Hours', 'Weekly Average'];
        $filename = 'team_members_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($teamMembers, $headers, $filename);
    }

    /**
     * Export time logs of all team members to CSV
     *
     * @return StreamedResponse
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    #[Action(method: 'get', name: 'team.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        // Get all team members of the authenticated user
        $teamMembersQuery = Team::query()
            ->where('user_id', auth()->id())
            ->with('member');

        $teamMemberIds = $teamMembersQuery->get()->pluck('member.id');

        $query = TimeLog::query()->whereIn('user_id', $teamMemberIds);

        // Apply date filters if provided
        if (request()->get('start_date')) {
            $query->whereDate('start_timestamp', '>=', request('start_date'));
        }

        if (request()->get('end_date')) {
            $query->whereDate('start_timestamp', '<=', request('end_date'));
        }

        // Apply team member filter if provided
        if (request()->get('team_member_id') && request('team_member_id')) {
            // Validate that the team_member_id belongs to a team member of the authenticated user
            if (!$teamMemberIds->contains(request('team_member_id'))) {
                abort(403, 'You can only view time logs of members in your team.');
            }

            $query->where('user_id', request('team_member_id'));
        }

        // Apply project filter if provided
        if (request()->get('project_id') && request('project_id')) {
            // Validate that the project belongs to the logged-in user
            $userProjects = $this->getUserProjects()->pluck('id')->toArray();
            if (in_array(request('project_id'), $userProjects)) {
                $query->where('project_id', request('project_id'));
            }
        }

        // Apply paid/unpaid filter if provided
        if (request()->has('is_paid') && request('is_paid') !== '') {
            $isPaid = request('is_paid') === 'true' || request('is_paid') === '1';
            $query->where('is_paid', $isPaid);
        }

        $timeLogs = $query->with(['user', 'project'])->get()
            ->map(function ($timeLog) {
                return [
                    'id' => $timeLog->id,
                    'user_name' => $timeLog->user->name,
                    'project_name' => $timeLog->project ? $timeLog->project->name : 'No Project',
                    'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                    'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : '',
                    'duration' => round($timeLog->duration, 2),
                    'is_paid' => $timeLog->is_paid,
                ];
            });

        $headers = ['ID', 'Team Member', 'Project', 'Start Time', 'End Time', 'Duration (hours)', 'Paid'];
        $filename = 'team_time_logs_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($timeLogs, $headers, $filename);
    }
}
