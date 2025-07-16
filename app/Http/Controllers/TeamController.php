<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Http\Stores\ProjectStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Models\Team;
use App\Models\TimeLog;
use App\Models\User;
use App\Traits\ExportableTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
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

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function index()
    {
        $query = Team::query()
            ->where('user_id', auth()->id())
            ->with('member')
            ->when(request()->get('search'), function ($query): void {
                $search = request('search');
                $query->whereHas('member', function ($q) use ($search): void {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                });
            });

        $teamMembers = $query->get()
            ->map(function ($team): array {
                $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('user_id', $team->member->getkey()));
                $mappedTimeLogs = TimeLogStore::timeLogMapper($timeLogs);
                $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
                $unpaidHours = round($mappedTimeLogs->where('is_paid', false)->sum('duration'), 2);
                $unpaidAmount = TimeLogStore::unpaidAmountFromLogs(timeLogs: $timeLogs);
                $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

                return [
                    'id' => $team->member->getKey(),
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

    public function timeLogs(User $user)
    {
        Gate::authorize('viewTimeLogs', $user);

        $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('user_id', $user->getKey()));
        $mappedTimeLogs = TimeLogStore::timeLogMapper($timeLogs);

        $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
        $unpaidHours = round($mappedTimeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        $team = TeamStore::teamEntry(userId: auth()->id(), memberId: $user->getKey());
        $unpaidAmount = TimeLogStore::unpaidAmountFromLogs($timeLogs);
        $currency = $team instanceof Team ? $team->currency : 'USD';

        $projects = ProjectStore::userProjects(userId: auth()->id());

        return Inertia::render('team/time-logs', [
            'timeLogs' => $mappedTimeLogs,
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
                'currency' => 'USD'
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
        Gate::authorize('update', $user);

        $team = TeamStore::teamEntry(userId: auth()->id(), memberId: $user->getKey());

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
        Gate::authorize('update', $user);

        DB::beginTransaction();
        try {
            $data = $request->validated();

            if (empty($data['password'])) {
                unset($data['password']);
            } else {
                $data['password'] = Hash::make($data['password']);
            }

            $teamData = [
                'hourly_rate' => $data['hourly_rate'] ?? 0,
                'currency' => 'USD', // Fixed to USD and non-changeable
            ];
            unset($data['hourly_rate'], $data['currency']);

            $user->update($data);

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
        Gate::authorize('delete', $user);

        DB::beginTransaction();
        try {
            Team::query()->where('member_id', $user->getKey())->where('user_id', auth()->id())->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function allTimeLogs()
    {
        $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->whereIn('user_id', TeamStore::teamMembersIds(userId: auth()->id())));
        $unpaidAmount = TimeLogStore::unpaidAmountFromLogs(timeLogs: $timeLogs);
        $timeLogs = TimeLogStore::timeLogMapper(timeLogs: $timeLogs);
        $totalDuration = round($timeLogs->sum('duration'), 2);
        $unpaidHours = round($timeLogs->where('is_paid', false)->sum('duration'), 2);
        $weeklyAverage = $totalDuration > 0 ? round($totalDuration / 7, 2) : 0;

        $currency = 'USD';
        $projects = ProjectStore::userProjects(userId: auth()->id());

        $teamMembersList = TeamStore::teamMembers(userId: auth()->id())
            ->map(fn ($teamMember): array => ['id' => $teamMember->id, 'name' => $teamMember->member->name, 'email' => $teamMember->member->email]);

        return Inertia::render('team/all-time-logs', [
            'timeLogs' => $timeLogs,
            'filters' => [
                'start_date' => request('start_date', ''),
                'end_date' => request('end_date', ''),
                'user_id' => request('user_id', ''),
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

        if (request()->get('search')) {
            $search = request('search');
            $query->whereHas('member', function ($q) use ($search): void {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $teamMembers = $query->get()
            ->map(function ($team): array {
                $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->where('user_id', $team->member->id));
                $mappedTimeLogs = TimeLogStore::timeLogMapper($timeLogs);
                $totalDuration = round($mappedTimeLogs->sum('duration'), 2);
                $unpaidHours = round($mappedTimeLogs->where('is_paid', false)->sum('duration'), 2);
                $unpaidAmount = TimeLogStore::unpaidAmountFromLogs(timeLogs: $timeLogs);
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
        $timeLogs = TimeLogStore::timeLogs(baseQuery: TimeLog::query()->whereIn('user_id', TeamStore::teamMembersIds(userId: auth()->id())));
        $mappedTimeLogs = $timeLogs->map(fn ($timeLog): array => [
            'id' => $timeLog->id,
            'user_name' => $timeLog->user->name,
            'project_name' => $timeLog->project ? $timeLog->project->name : 'No Project',
            'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
            'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : '',
            'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
            'note' => $timeLog->note,
            'is_paid' => $timeLog->is_paid,
        ]);

        $headers = ['ID', 'Team Member', 'Project', 'Start Time', 'End Time', 'Duration (hours)', 'Note', 'Paid'];
        $filename = 'team_time_logs_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv($mappedTimeLogs, $headers, $filename);
    }
}
