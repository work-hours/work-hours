<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Stores\TeamStore;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Msamgan\Lact\Attributes\Action;

final class ChatController extends Controller
{
    // Deprecated UI page (offcanvas is used instead) — keeping temporarily for reference
    public function index(Request $request): InertiaResponse
    {
        $user = $request->user();
        $selectedConversationId = $request->integer('conversation_id') ?: null;
        $targetUserId = $request->integer('user_id') ?: null;

        $conversations = $this->buildConversationsFor($user->id);

        $messages = [];
        if ($selectedConversationId) {
            $messages = $this->buildMessagesFor($user->id, $selectedConversationId);
        }

        $teamUsers = $this->teamUsersFor($user);

        return Inertia::render('chat/index', [
            'conversations' => $conversations,
            'messages' => $messages,
            'teamUsers' => $teamUsers,
            'targetUserId' => $targetUserId,
        ]);
    }

    /**
     * Conversations list + team users (JSON for offcanvas)
     */
    #[Action(method: 'get', name: 'chat.conversations', middleware: ['auth', 'verified'])]
    public function conversations(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'conversations' => $this->buildConversationsFor($user->id),
            'teamUsers' => $this->teamUsersFor($user),
        ]);
    }

    /**
     * Messages for a conversation (JSON) + mark as read
     */
    #[Action(method: 'get', name: 'chat.messages', middleware: ['auth', 'verified'])]
    public function messages(Request $request): JsonResponse
    {
        $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
        ]);
        $user = $request->user();

        return response()->json([
            'messages' => $this->buildMessagesFor($user->id, (int) $request->integer('conversation_id')),
        ]);
    }

    /**
     * Start a chat (JSON) — returns conversation_id
     */
    #[Action(method: 'post', name: 'chat.start-json', middleware: ['auth', 'verified'])]
    public function startJson(Request $request): JsonResponse
    {
        $conversationId = $this->doStart($request);

        return response()->json(['conversation_id' => $conversationId]);
    }

    /**
     * Send a message (JSON)
     */
    #[Action(method: 'post', name: 'chat.send-json', middleware: ['auth', 'verified'])]
    public function sendJson(Request $request): JsonResponse
    {
        $message = $this->doSend($request);

        return response()->json(['message_id' => $message->id]);
    }

    public function start(Request $request): RedirectResponse
    {
        $conversationId = $this->doStart($request);

        return redirect()->route('dashboard');
    }

    public function send(Request $request): RedirectResponse
    {
        $message = $this->doSend($request);

        return redirect()->route('dashboard')->with('message_id', $message->id);
    }

    // Helpers
    private function buildConversationsFor(int $userId)
    {
        return Conversation::query()
            ->whereHas('participants', static function ($q) use ($userId): void {
                $q->where('users.id', $userId);
            })
            ->with(['participants:id,name,email', 'messages' => static function ($q): void {
                $q->latest()->limit(1);
            }])
            ->orderByDesc('updated_at')
            ->get()
            ->map(static function (Conversation $c) use ($userId): array {
                $otherNames = $c->participants->where('id', '!=', $userId)->pluck('name')->values()->all();

                return [
                    'id' => $c->id,
                    'title' => $c->is_group ? ($c->title ?? 'Group') : ($otherNames[0] ?? 'Conversation'),
                    'lastMessage' => optional($c->messages->first())->body,
                    'updatedAt' => $c->updated_at?->toIso8601String(),
                ];
            });
    }

    private function buildMessagesFor(int $userId, int $conversationId)
    {
        $conv = Conversation::query()
            ->whereKey($conversationId)
            ->whereHas('participants', fn ($q) => $q->where('users.id', $userId))
            ->firstOrFail();

        // Mark incoming unread messages as read
        $conv->messages()
            ->whereNull('read_at')
            ->where('user_id', '!=', $userId)
            ->update(['read_at' => now()]);

        $conv->load(['messages' => fn ($q) => $q->with('user:id,name')->orderBy('id')]);

        return $conv->messages->map(static fn (Message $m): array => [
            'id' => $m->id,
            'body' => $m->body,
            'user' => [
                'id' => $m->user_id,
                'name' => $m->user?->name,
            ],
            'createdAt' => $m->created_at?->toIso8601String(),
            'isMine' => (int) $m->user_id === (int) $userId,
        ]);
    }

    private function teamUsersFor(User $user)
    {
        $context = TeamStore::getContextFor($user);
        $teamMemberIds = $context['memberIds'];
        $leaderIds = $context['leaderIds'];
        $ids = array_values(array_unique(array_merge($teamMemberIds, $leaderIds)));
        if (empty($ids)) {
            return [];
        }

        return User::query()->whereIn('id', $ids)->get(['id', 'name', 'email'])->map(static fn (User $u): array => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
        ]);
    }

    private function doStart(Request $request): int
    {
        $data = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $authId = (int) $request->user()->id;
        $targetId = (int) $data['user_id'];

        // ensure they are connected (leader or member) - optional minimal check
        $ctx = TeamStore::getContextFor($request->user());
        $allowed = in_array($targetId, array_merge($ctx['memberIds'], $ctx['leaderIds']), true) || $authId === $targetId;
        abort_unless($allowed, 403);

        $conversationId = DB::transaction(function () use ($authId, $targetId): int {
            // find existing one-on-one
            $existing = Conversation::query()
                ->where('is_group', false)
                ->whereHas('participants', fn ($q) => $q->where('users.id', $authId))
                ->whereHas('participants', fn ($q) => $q->where('users.id', $targetId))
                ->first();
            if ($existing) {
                return (int) $existing->id;
            }
            $c = Conversation::query()->create([
                'is_group' => false,
                'title' => null,
            ]);
            $c->participants()->attach([$authId, $targetId]);

            return (int) $c->id;
        });

        return $conversationId;
    }

    private function doSend(Request $request): Message
    {
        $data = $request->validate([
            'conversation_id' => ['required', 'integer', 'exists:conversations,id'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $conversation = Conversation::query()
            ->whereKey($data['conversation_id'])
            ->whereHas('participants', fn ($q) => $q->where('users.id', $request->user()->id))
            ->firstOrFail();

        $message = $conversation->messages()->create([
            'user_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        $conversation->touch();

        return $message;
    }
}
