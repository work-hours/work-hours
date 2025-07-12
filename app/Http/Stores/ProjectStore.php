<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Http\QueryFilters\ProjectTimeLog\EndDateFilter;
use App\Http\QueryFilters\ProjectTimeLog\IsPaidFilter;
use App\Http\QueryFilters\ProjectTimeLog\StartDateFilter;
use App\Http\QueryFilters\ProjectTimeLog\UserIdFilter;
use App\Models\Project;
use App\Models\Team;
use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Collection;

final class ProjectStore
{
    public static function userProjects(int $userId): Collection
    {
        $ownedProjects = Project::query()
            ->where('user_id', $userId)
            ->with(['teamMembers', 'user'])
            ->get();

        $assignedProjects = Project::query()
            ->whereHas('teamMembers', function ($query) use ($userId): void {
                $query->where('users.id', $userId);
            })
            ->where('user_id', '!=', $userId)
            ->with(['teamMembers', 'user'])
            ->get();

        return $ownedProjects->concat($assignedProjects);
    }

    public static function teamMembers(Project $project, bool $includeCreator = true): Collection
    {
        $teamMembers = $project->teamMembers()
            ->get()
            ->map(fn($member): array => [
                'id' => $member->id,
                'name' => $member->name,
                'email' => $member->email,
            ]);

        $creatorIncluded = $teamMembers->contains(fn($member): bool => $member['id'] === $project->user_id);

        if (! $creatorIncluded && $includeCreator) {
            $teamMembers->push([
                'id' => $project->user->id,
                'name' => $project->user->name,
                'email' => $project->user->email,
            ]);
        }

        return $teamMembers;
    }

    public static function timeLogs(Project $project): Collection
    {
        return app(Pipeline::class)
            ->send(TimeLog::query()->where('project_id', $project->getKey()))
            ->through([
                StartDateFilter::class,
                EndDateFilter::class,
                UserIdFilter::class,
                IsPaidFilter::class,
            ])
            ->thenReturn()
            ->with('user')->get();
    }

    public static function unpaidAmount(Collection $timeLogs): float
    {
        $unpaidAmount = 0;
        $timeLogs->each(function (TimeLog $timeLog) use (&$unpaidAmount): void {
            $hourlyRate = Team::memberHourlyRate(project: $timeLog->project, memberId: $timeLog->user_id);
            if (! $timeLog['is_paid']) {
                $unpaidAmount += $timeLog['duration'] * $hourlyRate;
            }
        });

        return round($unpaidAmount, 2);
    }

    public static function timeLogMapper(Collection $timeLogs): Collection
    {
        return $timeLogs->map(fn ($timeLog): array => [
            'id' => $timeLog->id,
            'user_id' => $timeLog->user_id,
            'user_name' => $timeLog->user ? $timeLog->user->name : null,
            'start_timestamp' => Carbon::parse($timeLog->start_timestamp)->toDateTimeString(),
            'end_timestamp' => $timeLog->end_timestamp ? Carbon::parse($timeLog->end_timestamp)->toDateTimeString() : null,
            'duration' => $timeLog->duration ? round($timeLog->duration, 2) : 0,
            'is_paid' => $timeLog->is_paid,
        ]);
    }
}
