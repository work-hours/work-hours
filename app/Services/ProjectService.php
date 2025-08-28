<?php

declare(strict_types=1);

namespace App\Services;

use App\Http\Stores\ClientStore;
use App\Http\Stores\TeamStore;
use Illuminate\Http\Request;

final readonly class ProjectService
{
    /**
     * Fetch clients and team members for the given user.
     *
     * @return array{0: \Illuminate\Support\Collection, 1: \Illuminate\Support\Collection}
     */
    public function clientsAndTeamMembers(int $userId): array
    {
        $clients = ClientStore::userClients($userId)
            ->map(fn ($client): array => [
                'id' => $client->id,
                'name' => $client->name,
            ]);

        $teamMembers = TeamStore::teamMembers(userId: $userId);

        return [$clients, $teamMembers];
    }

    /**
     * Build the sync array for project->teamMembers() from the incoming request.
     *
     * @return array<int, array{is_approver: bool, hourly_rate: (int|float|null), currency: (string|null)}> | null
     */
    public function buildTeamMembersSyncFromRequest(Request $request): ?array
    {
        if (! $request->has('team_members')) {
            return null;
        }

        $rates = $request->input('team_member_rates', []);

        return collect($request->input('team_members'))
            ->mapWithKeys(function ($memberId) use ($request, $rates) {
                $isApprover = $request->has('approvers') && in_array($memberId, (array) $request->input('approvers'), true);
                $rate = $rates[$memberId]['hourly_rate'] ?? null;
                $currency = $rates[$memberId]['currency'] ?? null;

                return [
                    $memberId => [
                        'is_approver' => $isApprover,
                        'hourly_rate' => $rate,
                        'currency' => $currency,
                    ],
                ];
            })
            ->toArray();
    }
}
