<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class TeamController extends Controller
{
    use ExportableTrait;

    public function index()
    {
        $query = Team::query()
            ->where('user_id', auth()->id())
            ->with('member');
        if (request()->get('search')) {
            $search = request('search');
            $query->whereHas('member', function ($q) use ($search): void {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $teamMembers = $query->get()
            ->map(function ($team): array {
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

                // Calculate unpaid hours
                $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);

                // Calculate unpaid amount
                $unpaidAmount = round($unpaidHours * $team->hourly_rate, 2);

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
                    'unpaidHours' => $unpaidHours,
                    'unpaidAmount' => $unpaidAmount,
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

            if (! $user) {
                $userData = $request->safe()->except(['hourly_rate', 'currency']);
                $user = User::query()->create($userData);
            }

            $teamData = [
                'user_id' => auth()->id(),
                'member_id' => $user->getKey(),
                'hourly_rate' => $request->get('hourly_rate') ?? 0,
                'currency' => mb_strtoupper((string) $request->get('currency')) ?? 'USD',
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

        abort_unless($team, 403, 'You can only edit members of your team.');

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

        abort_unless($isTeamMember, 403, 'You can only update members of your team.');

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
                'currency' => $data['currency'] ?? 'USD',
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

        abort_unless($isTeamMember, 403, 'You can only delete members of your team.');

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

        abort_unless($isTeamMember, 403, 'You can only view time logs of members in your team.');

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
            ->map(fn ($timeLog): array => [
                'id' => $timeLog->id,
                'project_id' => $timeLog->project_id,
                'project_name' => $timeLog->project ? $timeLog->project->name : null,
                'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
                'is_paid' => $timeLog->is_paid,
            ]);

        $totalDuration = round($timeLogs->sum('duration'), 2);
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        // Get the team member's hourly rate
        $team = Team::query()
            ->where('user_id', auth()->id())
            ->where('member_id', $user->id)
            ->first();

        // Calculate unpaid amount
        $hourlyRate = $team ? $team->hourly_rate : 0;
        $unpaidAmount = round($unpaidHours * $hourlyRate, 2);
        $currency = $team ? $team->currency : 'USD';

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
            'unpaidAmount' => $unpaidAmount,
            'currency' => $currency,
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
            ->map(fn ($team): array => [
                'id' => $team->member->id,
                'name' => $team->member->name,
            ]);

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
            abort_unless($teamMemberIds->contains(request('team_member_id')), 403, 'You can only view time logs of members in your team.');

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
            ->map(fn ($timeLog): array => [
                'id' => $timeLog->id,
                'user_name' => $timeLog->user->name,
                'project_id' => $timeLog->project_id,
                'project_name' => $timeLog->project ? $timeLog->project->name : null,
                'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
                'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
                'is_paid' => $timeLog->is_paid,
            ]);

        $totalDuration = round($timeLogs->sum('duration'), 2);
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        // Calculate unpaid amount
        $unpaidAmount = 0;

        // Group unpaid logs by user
        $unpaidLogsByUser = [];
        foreach ($timeLogs as $timeLog) {
            if (! $timeLog['is_paid']) {
                // Get the user ID from the original query
                $userId = TimeLog::query()->find($timeLog['id'])->user_id;
                $userName = $timeLog['user_name'];

                if (! isset($unpaidLogsByUser[$userId])) {
                    $unpaidLogsByUser[$userId] = [
                        'name' => $userName,
                        'hours' => 0,
                    ];
                }

                $unpaidLogsByUser[$userId]['hours'] += $timeLog['duration'];
            }
        }

        // Calculate unpaid amount for each user
        foreach ($unpaidLogsByUser as $userId => $userData) {
            $memberUnpaidHours = $userData['hours'];

            $hourlyRate = Team::query()
                ->where('member_id', $userId)
                ->value('hourly_rate') ?? 0;

            $unpaidAmount += $memberUnpaidHours * $hourlyRate;
        }

        // Get default currency (USD) or determine a common currency
        $currency = 'USD';

        // Try to get the currency of the authenticated user if they are part of a team
        $authUserCurrency = Team::query()
            ->where('member_id', auth()->id())
            ->value('currency');

        if ($authUserCurrency) {
            $currency = $authUserCurrency;
        }

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
            'unpaidAmount' => round($unpaidAmount, 2),
            'currency' => $currency,
            'weeklyAverage' => $weeklyAverage,
        ]);
    }

    /**
     * Export team members to CSV
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
            $query->whereHas('member', function ($q) use ($search): void {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $teamMembers = $query->get()
            ->map(function ($team): array {
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

                // Calculate unpaid hours
                $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);

                // Calculate unpaid amount
                $unpaidAmount = round($unpaidHours * $team->hourly_rate, 2);

                // Calculate weekly average
                $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

                return [
                    'id' => $team->member->id,
                    'name' => $team->member->name,
                    'email' => $team->member->email,
                    'hourly_rate' => $team->hourly_rate,
                    'currency' => $team->currency,
                    'total_hours' => $totalDuration,
                    'unpaid_hours' => $unpaidHours,
                    'unpaid_amount' => $unpaidAmount,
                    'weekly_average' => $weeklyAverage,
                ];
            });

        $headers = ['ID', 'Name', 'Email', 'Hourly Rate', 'Currency', 'Total Hours', 'Unpaid Hours', 'Unpaid Amount', 'Weekly Average'];
        $filename = 'team_members_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($teamMembers, $headers, $filename);
    }

    /**
     * Export time logs of all team members to CSV
     *
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
            abort_unless($teamMemberIds->contains(request('team_member_id')), 403, 'You can only view time logs of members in your team.');

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
            ->map(fn ($timeLog): array => [
                'id' => $timeLog->id,
                'user_name' => $timeLog->user->name,
                'project_name' => $timeLog->project ? $timeLog->project->name : 'No Project',
                'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
                'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : '',
                'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
                'is_paid' => $timeLog->is_paid,
            ]);

        $headers = ['ID', 'Team Member', 'Project', 'Start Time', 'End Time', 'Duration (hours)', 'Paid'];
        $filename = 'team_time_logs_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($timeLogs, $headers, $filename);
    }

    /**
     * Get projects created by or assigned to the current user
     */
    private function getUserProjects()
    {
        $userId = auth()->id();

        return Project::query()->where('user_id', $userId)
            ->orWhereHas('teamMembers', function ($query) use ($userId): void {
                $query->where('member_id', $userId);
            })
            ->get(['id', 'name']);
    }
}
