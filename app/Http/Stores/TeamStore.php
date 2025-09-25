<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Models\Team;
use App\Models\User;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

final class TeamStore
{
    public static function teamMembersIds(int $userId): Collection
    {
        return Team::query()->where('user_id', $userId)->pluck('member_id');
    }

    public static function teamMemberCount(int $userId): int
    {
        return Team::query()->where('user_id', $userId)->count();
    }

    public static function teamMembers(int $userId, bool $map = true): ?Collection
    {
        $team = Team::query()
            ->where('user_id', $userId)
            ->with('member')
            ->get();

        if ($map) {
            return $team->map(fn ($team): array => [
                'id' => $team->member->id,
                'name' => $team->member->name,
                'email' => $team->member->email,
                'hourly_rate' => (float) ($team->hourly_rate ?? 0),
                'currency' => $team->currency ?? 'USD',
                'non_monetary' => (bool) ($team->non_monetary ?? false),
                'is_employee' => (bool) ($team->is_employee ?? false),
            ]);
        }

        return $team;
    }

    public static function teamEntry(int $userId, int $memberId): ?Team
    {
        return Team::query()
            ->where('user_id', $userId)
            ->where('member_id', $memberId)
            ->first();
    }

    /**
     * Create or get a user by email and attach to the given user's team.
     * Returns an array with the created/found user and whether it's a new user.
     *
     * @param  array<string, mixed>  $userData
     * @return array{user: User, is_new: bool}
     *
     * @throws Exception|Throwable
     */
    public static function createOrAttachMemberForUser(
        int $ownerUserId,
        array $userData,
        ?float $hourlyRate,
        ?string $currency,
        bool $nonMonetary,
        bool $isEmployee
    ): array {
        return DB::transaction(function () use ($ownerUserId, $userData, $hourlyRate, $currency, $nonMonetary, $isEmployee): array {
            $user = User::query()->where('email', $userData['email'])->first();
            $isNewUser = false;

            if (! $user) {
                $isNewUser = true;
                $user = User::query()->create($userData);
            }

            $finalNonMonetary = $isEmployee ? true : $nonMonetary;
            $finalHourlyRate = $finalNonMonetary ? 0 : ($hourlyRate ?? 0);

            Team::query()->updateOrCreate(
                [
                    'user_id' => $ownerUserId,
                    'member_id' => $user->getKey(),
                ],
                [
                    'hourly_rate' => $finalHourlyRate,
                    'currency' => $currency,
                    'non_monetary' => $finalNonMonetary,
                    'is_employee' => $isEmployee,
                ]
            );

            $user->currencies()->firstOrCreate(['code' => 'USD']);

            return ['user' => $user, 'is_new' => $isNewUser];
        });
    }

    /**
     * Update a member user's details and the team entry for a specific owner.
     * Returns flags indicating password change state and the plain password (for notifications).
     *
     * @param  array<string, mixed>  $data
     * @return array{password_changed: bool, plain_password: ?string}
     *
     * @throws Exception|Throwable
     */
    public static function updateMemberForUser(int $ownerUserId, User $memberUser, array $data): array
    {
        return DB::transaction(function () use ($ownerUserId, $memberUser, $data): array {
            $passwordChanged = false;
            $plainPassword = null;

            if (! empty($data['password'])) {
                $plainPassword = (string) $data['password'];

                $passwordChanged = true;
            } else {
                unset($data['password']);
            }

            $isEmployee = isset($data['is_employee']) && (bool) $data['is_employee'];
            $nonMonetary = isset($data['non_monetary']) && (bool) $data['non_monetary'];
            if ($isEmployee) {
                $nonMonetary = true;
            }
            $hourlyRate = $nonMonetary ? 0 : ((float) ($data['hourly_rate'] ?? 0));

            $teamData = [
                'hourly_rate' => $hourlyRate,
                'currency' => $data['currency'] ?? null,
                'non_monetary' => $nonMonetary,
                'is_employee' => $isEmployee,
            ];

            unset($data['hourly_rate'], $data['currency'], $data['non_monetary'], $data['is_employee'], $data['permissions']);

            $memberUser->update($data);

            Team::query()
                ->where('user_id', $ownerUserId)
                ->where('member_id', $memberUser->getKey())
                ->update($teamData);

            return [
                'password_changed' => $passwordChanged,
                'plain_password' => $plainPassword,
            ];
        });
    }

    public static function filters(): array
    {
        return [
            'start-date' => request('start-date', ''),
            'end-date' => request('end-date', ''),
            'search' => request('search', ''),
        ];
    }

    public static function removeUserFromTeam(int $teamLeaderId, int $memberId): void
    {
        Team::query()
            ->where('user_id', $teamLeaderId)
            ->where('member_id', $memberId)
            ->delete();
    }

    public static function exportHeaders(): array
    {
        return [
            'id',
            'name',
            'email',
            'hourly_rate',
            'currency',
            'non_monetary',
            'totalHours',
            'weeklyAverage',
            'unpaidHours',
            'unpaidAmount',
        ];
    }

    /**
     * Build the team context for the given user.
     *
     * Returns an array with keys:
     * - leaderIds: list<int> IDs of leaders for teams where the user is a member
     * - memberIds: list<int> IDs of members for teams where the user is a leader
     *
     * @return array{leaderIds: list<int>, memberIds: list<int>}
     */
    public static function getContextFor(User $user): array
    {
        $memberIds = Team::query()
            ->where('user_id', $user->id)
            ->pluck('member_id')
            ->map(static fn ($id): int => (int) $id)
            ->values()
            ->all();

        $leaderIds = Team::query()
            ->where('member_id', $user->id)
            ->pluck('user_id')
            ->map(static fn ($id): int => (int) $id)
            ->unique()
            ->values()
            ->all();

        return [
            'leaderIds' => $leaderIds,
            'memberIds' => $memberIds,
        ];
    }
}
