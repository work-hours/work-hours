<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Mappers\Team\TeamListMapper;
use App\Http\QueryBuilders\Team\TeamListSearchableQuery;
use App\Http\QueryBuilders\Team\TimeLogQuery;
use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Http\Stores\TagStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
use App\Models\Permission;
use App\Models\User;
use App\Notifications\PasswordChanged;
use App\Notifications\TeamMemberAdded;
use App\Notifications\TeamMemberCreated;
use App\Services\TeamService;
use App\Traits\ExportableTrait;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class TeamController extends Controller
{
    use ExportableTrait;

    public function __construct(private readonly TeamService $teamService) {}

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function index()
    {
        $permissionsByModule = Permission::query()
            ->orderBy('module')
            ->orderBy('name')
            ->get()
            ->groupBy(fn ($perm) => (string) ($perm->module ?? 'General'))
            ->map(fn ($group) => $group->map(fn ($perm) => [
                'id' => $perm->id,
                'name' => $perm->name,
                'description' => $perm->description,
            ])->values())
            ->toArray();

        return Inertia::render('team/index', [
            'teamMembers' => TeamListSearchableQuery::builder()->get()->map(fn ($team): array => TeamListMapper::map($team)),
            'filters' => TeamStore::filters(),
            'currencies' => auth()->user()->currencies,
            'genericEmails' => config('generic_email'),
            'permissionsByModule' => $permissionsByModule,
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'team.store', middleware: ['auth', 'verified'])]
    public function store(StoreTeamMemberRequest $request): void
    {
        $userData = $request->safe()->except(['hourly_rate', 'currency', 'non_monetary', 'is_employee', 'permissions']);
        $nonMonetary = $request->boolean('non_monetary', false);
        $isEmployee = $request->boolean('is_employee', false);

        $result = TeamStore::createOrAttachMemberForUser(
            ownerUserId: auth()->id(),
            userData: $userData,
            hourlyRate: (int) $request->get('hourly_rate'),
            currency: $request->get('currency'),
            nonMonetary: $nonMonetary,
            isEmployee: $isEmployee,
        );

        $user = $result['user'];
        $isNewUser = $result['is_new'];

        // Sync permissions if provided and user is marked as employee
        if ($isEmployee) {
            $permissions = (array) $request->input('permissions', []);
            $user->permissions()->sync($permissions);
        } else {
            // Ensure no permissions remain if not employee
            $user->permissions()->detach();
        }

        $creator = auth()->user();
        if ($isNewUser) {
            $user->notify(new TeamMemberCreated($user, $creator, $userData['password']));
        } else {
            $user->notify(new TeamMemberAdded($user, $creator));
            \App\Events\TeamMemberAdded::dispatch($user, $creator);
        }
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'team.update', params: ['user'], middleware: ['auth', 'verified'])]
    public function update(UpdateTeamMemberRequest $request, User $user): void
    {
        Gate::authorize('update', $user);

        $data = $request->validated();

        $result = TeamStore::updateMemberForUser(
            ownerUserId: auth()->id(),
            memberUser: $user,
            data: $data,
        );

        // Sync permissions only if provided, to avoid wiping existing unintentionally
        if ($request->has('is_employee')) {
            if ($request->boolean('is_employee')) {
                if ($request->has('permissions')) {
                    $user->permissions()->sync((array) $request->input('permissions', []));
                }
            } else {
                // Not an employee: remove all permissions
                $user->permissions()->detach();
            }
        }

        if ($result['password_changed']) {
            $user->notify(new PasswordChanged($user, auth()->user(), $result['plain_password']));
        }
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'team.destroy', params: ['user'], middleware: ['auth', 'verified'])]
    public function destroy(User $user): void
    {
        Gate::authorize('delete', $user);

        DB::beginTransaction();
        try {
            TeamStore::removeUserFromTeam(teamLeaderId: auth()->id(), memberId: $user->getKey());
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function allTimeLogs()
    {
        $baseQuery = TimeLogQuery::builder(userId: auth()->id());

        [$paginatedLogs, $allFilteredLogs] = $this->teamService->paginateWithFull($baseQuery);

        $teamMembersList = TeamStore::teamMembers(userId: auth()->id());
        $tags = TagStore::userTags(userId: auth()->id());

        return Inertia::render('team/all-time-logs', [
            'teamMembers' => $teamMembersList,
            'tags' => $tags,
            ...TimeLogStore::resData(timeLogs: $paginatedLogs, fullTimeLogsForStats: $allFilteredLogs),
        ]);
    }

    public function timeLogs(User $user)
    {
        Gate::authorize('viewTimeLogs', $user);

        $baseQuery = TimeLogQuery::builder(userId: auth()->id(), member: $user);

        [$paginatedLogs, $allFilteredLogs] = $this->teamService->paginateWithFull($baseQuery);

        return Inertia::render('team/time-logs', [
            'user' => $user,
            ...TimeLogStore::resData(timeLogs: $paginatedLogs, fullTimeLogsForStats: $allFilteredLogs),
        ]);
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    #[Action(method: 'get', name: 'team.export', middleware: ['auth', 'verified'])]
    public function export(): StreamedResponse
    {
        $teamMembers = TeamListSearchableQuery::builder()->get()->map(fn ($team): array => TeamListMapper::map($team));
        $headers = TeamStore::exportHeaders();
        $filename = $this->teamService->csvDateFilename('team_members');

        return $this->exportToCsv($teamMembers, $headers, $filename);
    }

    #[Action(method: 'get', name: 'team.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        $timeLogs = TimeLogQuery::builder(userId: auth()->id())->get();
        $mappedTimeLogs = TimeLogStore::timeLogExportMapper(timeLogs: $timeLogs);
        $headers = TimeLogStore::timeLogExportHeaders();
        $filename = $this->teamService->csvDateFilename('team_time_logs');

        return $this->exportToCsv($mappedTimeLogs, $headers, $filename);
    }
}
