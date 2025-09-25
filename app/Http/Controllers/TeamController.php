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
        $leaderIdForListing = $this->teamService->leaderIdForActionWithPermission(
            authUser: $authUser,
            permission: 'List',
            forbiddenMessage: 'You do not have permission to view team members.'
        );

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

        $ownerUserId = $this->teamService->leaderIdForActionWithPermission(
            authUser: $authUser,
            permission: 'Create',
            forbiddenMessage: 'You do not have permission to create team members.'
        ) ?? (int) $authUser->getKey();

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
        $this->teamService->applyEmployeePermissions(
            user: $user,
            isEmployee: $isEmployee,
            permissions: $isEmployee ? (array) $request->input('permissions', []) : null,
        );

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
        $ownerUserId = $this->teamService->resolveOwnerIdForMemberAction(
            authUser: $authUser,
            targetUser: $user,
            permission: 'Update',
            unauthorizedMessage: 'You are not authorized to update this member.'
        );

        $result = TeamStore::updateMemberForUser(
            ownerUserId: $ownerUserId,
            memberUser: $user,
            data: $data,
        );
        if ($request->has('is_employee')) {
            $this->teamService->applyEmployeePermissions(
                user: $user,
                isEmployee: $request->boolean('is_employee'),
                permissions: $request->has('permissions') ? (array) $request->input('permissions', []) : null,
            );
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

        $teamLeaderId = $this->teamService->resolveOwnerIdForMemberAction(
            authUser: $authUser,
            targetUser: $user,
            permission: 'Delete',
            unauthorizedMessage: 'You are not authorized to delete this member.'
        );

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
        $this->teamService->ensureEmployeeHasPermission(
            authUser: $authUser,
            permission: 'View Time Logs',
            forbiddenMessage: 'You do not have permission to view time logs.'
        );

        $userId = TeamStore::employeeLeaderIdFor($authUser->getKey()) ?? $authUser->getKey();

        $baseQuery = TimeLogQuery::builder(userId: $userId);

        [$paginatedLogs, $allFilteredLogs] = $this->teamService->paginateWithFull($baseQuery);

        $teamMembersList = TeamStore::teamMembers(userId: $userId);

        $tags = TagStore::userTags(userId: $userId);

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
        $leaderIdForListing = $this->teamService->leaderIdForActionWithPermission(
            authUser: $authUser,
            permission: 'List',
            forbiddenMessage: 'You do not have permission to export team members.'
        );

        $teamMembers = TeamListSearchableQuery::builder($leaderIdForListing)->get()->map(fn ($team): array => TeamListMapper::map($team));
        $headers = TeamStore::exportHeaders();
        $filename = $this->teamService->csvDateFilename('team_members');

        return $this->exportToCsv($teamMembers, $headers, $filename);
    }

    #[Action(method: 'get', name: 'team.export-time-logs', middleware: ['auth', 'verified'])]
    public function exportTimeLogs(): StreamedResponse
    {
        $authUser = auth()->user();
        $this->teamService->ensureEmployeeHasPermission(
            authUser: $authUser,
            permission: 'View Time Logs',
            forbiddenMessage: 'You do not have permission to export time logs.'
        );

        $userId = TeamStore::employeeLeaderIdFor($authUser->getKey()) ?? $authUser->getKey();

        $timeLogs = TimeLogQuery::builder(userId: $userId)->get();
        $mappedTimeLogs = TimeLogStore::timeLogExportMapper(timeLogs: $timeLogs);
        $headers = TimeLogStore::timeLogExportHeaders();
        $filename = $this->teamService->csvDateFilename('team_time_logs');

        return $this->exportToCsv($mappedTimeLogs, $headers, $filename);
    }
}
