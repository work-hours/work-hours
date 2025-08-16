<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectNote;
use Illuminate\Support\Collection;

final class ProjectNoteController extends Controller
{
    /**
     * List notes for a project (newest first)
     */
    public function index(Project $project): Collection
    {
        $project->loadMissing('teamMembers');
        $isOwner = $project->user_id === auth()->id();
        $isTeamMember = $project->teamMembers->contains('id', auth()->id());

        abort_if(! $isOwner && ! $isTeamMember, 403, 'Unauthorized action.');

        return $project->notes()
            ->with(['user:id,name'])
            ->latest('created_at')
            ->get()
            ->map(fn (ProjectNote $note): array => [
                'id' => $note->id,
                'body' => $note->body,
                'created_at' => $note->created_at?->toIso8601String(),
                'updated_at' => $note->updated_at?->toIso8601String(),
                'user' => [
                    'id' => $note->user_id,
                    'name' => $note->user->name,
                ],
                'can_edit' => $note->user_id === auth()->id() || $isOwner,
                'can_delete' => $note->user_id === auth()->id() || $isOwner,
            ]);
    }

    /**
     * Store a new note
     */
    public function store(Project $project): void
    {
        $project->loadMissing('teamMembers');
        $isOwner = $project->user_id === auth()->id();
        $isTeamMember = $project->teamMembers->contains('id', auth()->id());

        abort_if(! $isOwner && ! $isTeamMember, 403, 'Unauthorized action.');

        request()->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        ProjectNote::query()->create([
            'project_id' => $project->id,
            'user_id' => auth()->id(),
            'body' => (string) request('body'),
        ]);

        back()->throwResponse();
    }

    /**
     * Update a note
     */
    public function update(Project $project, ProjectNote $note): void
    {
        abort_if($note->project_id !== $project->id, 404, 'Note not found for this project.');

        $isOwner = $project->user_id === auth()->id();
        $isCreator = $note->user_id === auth()->id();

        abort_if(! $isOwner && ! $isCreator, 403, 'Unauthorized action.');

        request()->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $note->update([
            'body' => (string) request('body'),
        ]);

        back()->throwResponse();
    }

    /**
     * Delete a note
     */
    public function destroy(Project $project, ProjectNote $note): void
    {
        abort_if($note->project_id !== $project->id, 404, 'Note not found for this project.');

        $isOwner = $project->user_id === auth()->id();
        $isCreator = $note->user_id === auth()->id();

        abort_if(! $isOwner && ! $isCreator, 403, 'Unauthorized action.');

        $note->delete();

        back()->throwResponse();
    }
}
