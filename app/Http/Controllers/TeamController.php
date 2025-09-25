<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Mappers\Team\TeamListMapper;
use App\Http\QueryBuilders\Team\TeamListSearchableQuery;
use App\Http\QueryBuilders\Team\TimeLogQuery;
use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
use App\Http\Stores\PermissionStore;
use App\Http\Stores\TagStore;
use App\Http\Stores\TeamStore;
use App\Http\Stores\TimeLogStore;
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
        $permissionsByModule = PermissionStore::permissionsByModule();

        $authUser = auth()->user();
        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());

        $leaderIdForListing = null;
        if ($employeeLeaderId) {
            $hasListPermission = PermissionStore::userHasTeamPermission($authUser, 'List');
            abort_unless($hasListPermission, 403, 'You do not have permission to view team members.');
            $leaderIdForListing = (int) $employeeLeaderId;
        }

        return Inertia::render('team/index', [
            'teamMembers' => TeamListSearchableQuery::builder($leaderIdForListing)->get()->map(fn ($team): array => TeamListMapper::map($team)),
            'filters' => TeamStore::filters(),
            'currencies' => $authUser->currencies,
            'genericEmails' => config('generic_email'),
            'permissionsByModule' => $permissionsByModule,
            'myTeamPermissions' => PermissionStore::userTeamPermissionNames($authUser),
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'team.store', middleware: ['auth', 'verified'])]
    public function store(StoreTeamMemberRequest $request): void
    {
        $authUser = auth()->user();
        $userData = $request->safe()->except(['hourly_rate', 'currency', 'non_monetary', 'is_employee', 'permissions']);
        $nonMonetary = $request->boolean('non_monetary', false);
        $isEmployee = $request->boolean('is_employee', false);

        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());

        $ownerUserId = (int) $authUser->getKey();
        if ($employeeLeaderId) {
            $hasCreatePermission = PermissionStore::userHasTeamPermission($authUser, 'Create');
            abort_unless($hasCreatePermission, 403, 'You do not have permission to create team members.');
            $ownerUserId = (int) $employeeLeaderId;
        }

        $result = TeamStore::createOrAttachMemberForUser(
            ownerUserId: $ownerUserId,
            userData: $userData,
            hourlyRate: (int) $request->get('hourly_rate'),
            currency: $request->get('currency'),
            nonMonetary: $nonMonetary,
            isEmployee: $isEmployee,
            createdBy: (int) $authUser->getKey(),
        );

        $user = $result['user'];
        $isNewUser = $result['is_new'];
        if ($isEmployee) {
            $permissions = (array) $request->input('permissions', []);
            $user->permissions()->sync($permissions);
        } else {
            $user->permissions()->detach();
        }

        $creator = $authUser;
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
        $authUser = auth()->user();

        $data = $request->validated();
        $ownerUserId = (int) $authUser->getKey();
        $isLeaderOfMember = TeamStore::isLeaderOfMemberIds($authUser->getKey(), $user->getKey());

        if (! $isLeaderOfMember) {
            $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());

            abort_unless($employeeLeaderId, 403, 'You are not authorized to update this member.');

            $hasUpdatePermission = PermissionStore::userHasTeamPermission($authUser, 'Update');

            $targetUnderLeader = TeamStore::isLeaderOfMemberIds((int) $employeeLeaderId, $user->getKey());

            abort_if(! $hasUpdatePermission || ! $targetUnderLeader, 403, 'You are not authorized to update this member.');

            $ownerUserId = (int) $employeeLeaderId;
        }

        $result = TeamStore::updateMemberForUser(
            ownerUserId: $ownerUserId,
            memberUser: $user,
            data: $data,
        );
        if ($request->has('is_employee')) {
            if ($request->boolean('is_employee')) {
                if ($request->has('permissions')) {
                    $user->permissions()->sync((array) $request->input('permissions', []));
                }
            } else {
                $user->permissions()->detach();
            }
        }

        if ($result['password_changed']) {
            $user->notify(new PasswordChanged($user, $authUser, $result['plain_password']));
        }
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'team.destroy', params: ['user'], middleware: ['auth', 'verified'])]
    public function destroy(User $user): void
    {
        $authUser = auth()->user();

        $teamLeaderId = (int) $authUser->getKey();
        $isLeaderOfMember = TeamStore::isLeaderOfMemberIds($authUser->getKey(), $user->getKey());

        if (! $isLeaderOfMember) {
            $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());

            abort_unless($employeeLeaderId, 403, 'You are not authorized to delete this member.');

            $hasDeletePermission = PermissionStore::userHasTeamPermission($authUser, 'Delete');

            $targetUnderLeader = TeamStore::isLeaderOfMemberIds((int) $employeeLeaderId, $user->getKey());

            abort_if(! $hasDeletePermission || ! $targetUnderLeader, 403, 'You are not authorized to delete this member.');

            $teamLeaderId = (int) $employeeLeaderId;
        }

        DB::beginTransaction();
        try {
            TeamStore::removeUserFromTeam(teamLeaderId: $teamLeaderId, memberId: $user->getKey());
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function allTimeLogs()
    {
        $authUser = auth()->user();
        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());
        if ($employeeLeaderId) {
            $hasViewLogsPermission = PermissionStore::userHasTeamPermission($authUser, 'View Time Logs');
            abort_unless($hasViewLogsPermission, 403, 'You do not have permission to view time logs.');
        }

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
        $authUser = auth()->user();
        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());

        $leaderIdForListing = null;
        if ($employeeLeaderId) {
            $hasListPermission = PermissionStore::userHasTeamPermission($authUser, 'List');

            abort_unless($hasListPermission, 403, 'You do not have permission to export team members.');
            $leaderIdForListing = (int) $employeeLeaderId;
        }

        $teamMembers = TeamListSearchableQuery::builder($leaderIdForListing)->get()->map(fn ($team): array => TeamListMapper::map($team));
        $headers = TeamStore::exportHeaders();
        $filename = $this->teamService->csvDateFilename('team_members');

        return $this->exportToCsv($teamMembers, $headers, $filename);
    }

    #[Action(method: 'get', name: 'team.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        $authUser = auth()->user();
        $employeeLeaderId = TeamStore::employeeLeaderIdFor($authUser->getKey());
        if ($employeeLeaderId) {
            $hasViewLogsPermission = PermissionStore::userHasTeamPermission($authUser, 'View Time Logs');
            abort_unless($hasViewLogsPermission, 403, 'You do not have permission to export time logs.');
        }

        $timeLogs = TimeLogQuery::builder(userId: auth()->id())->get();
        $mappedTimeLogs = TimeLogStore::timeLogExportMapper(timeLogs: $timeLogs);
        $headers = TimeLogStore::timeLogExportHeaders();
        $filename = $this->teamService->csvDateFilename('team_time_logs');

        return $this->exportToCsv($mappedTimeLogs, $headers, $filename);
    }
}
