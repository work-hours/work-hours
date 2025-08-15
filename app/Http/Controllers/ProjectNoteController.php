<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectNote;
use Illuminate\Support\Collection;
use Msamgan\Lact\Attributes\Action;

final class ProjectNoteController extends Controller
{
    /**
     * List notes for a project (newest first)
     */
    #[Action(method: 'get', name: 'project.notes', params: ['project'], middleware: ['auth', 'verified'])]
    public function index(Project $project): Collection
    {
        // Allow project owner or team members to view notes
        $project->loadMissing('teamMembers');
        $isOwner = $project->user_id === auth()->id();
        $isTeamMember = $project->teamMembers->contains('id', auth()->id());

        abort_if(! $isOwner && ! $isTeamMember, 403, 'Unauthorized action.');

        return $project->notes()
            ->with(['user:id,name'])
            ->latest('created_at')
            ->get()
            ->map(fn (ProjectNote $note) => [
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
    #[Action(method: 'post', name: 'project.notes.store', params: ['project'], middleware: ['auth', 'verified'])]
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
    #[Action(method: 'put', name: 'project.notes.update', params: ['project', 'note'], middleware: ['auth', 'verified'])]
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
    #[Action(method: 'delete', name: 'project.notes.destroy', params: ['project', 'note'], middleware: ['auth', 'verified'])]
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
