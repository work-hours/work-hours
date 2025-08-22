<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Mappers\Team\TeamListMapper;
use App\Http\Mappers\Team\TeamUserMapper;
use App\Http\QueryBuilders\Team\TeamListSearchableQuery;
use App\Http\QueryBuilders\Team\TimeLogQuery;
use App\Http\Requests\StoreTeamMemberRequest;
use App\Http\Requests\UpdateTeamMemberRequest;
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
        return Inertia::render('team/index', [
            'teamMembers' => TeamListSearchableQuery::builder()->get()->map(fn ($team): array => TeamListMapper::map($team)),
            'filters' => TeamStore::filters(),
        ]);
    }

    /**
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'team.store', middleware: ['auth', 'verified'])]
    public function store(StoreTeamMemberRequest $request): void
    {
        $userData = $request->safe()->except(['hourly_rate', 'currency']);
        $nonMonetary = $request->boolean('non_monetary', false);

        $result = TeamStore::createOrAttachMemberForUser(
            ownerUserId: auth()->id(),
            userData: $userData,
            hourlyRate: (int) $request->get('hourly_rate'),
            currency: $request->get('currency'),
            nonMonetary: $nonMonetary,
        );

        $user = $result['user'];
        $isNewUser = $result['is_new'];

        $creator = auth()->user();
        if ($isNewUser) {
            $user->notify(new TeamMemberCreated($user, $creator, $userData['password']));
        } else {
            $user->notify(new TeamMemberAdded($user, $creator));
            \App\Events\TeamMemberAdded::dispatch($user, $creator);
        }
    }

    public function create()
    {
        return Inertia::render('team/create', [
            'currencies' => auth()->user()->currencies,
        ]);
    }

    public function edit(User $user)
    {
        Gate::authorize('update', $user);

        $team = TeamStore::teamEntry(userId: auth()->id(), memberId: $user->getKey());

        return Inertia::render('team/edit', [
            'user' => TeamUserMapper::map($user, $team),
            'currencies' => auth()->user()->currencies,
        ]);
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
