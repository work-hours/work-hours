<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Notifications\DatabaseNotification;
use Inertia\Response;
use Inertia\Inertia;
use Msamgan\Lact\Attributes\Action;

final class NotificationsController extends Controller
{
    /**
     * Display the notifications page.
     */
    public function index(): Response
    {
        return inertia('notifications');
    }

    /**
     * Get all notifications for the authenticated user.
     */
    #[Action(method: 'get', name: 'notifications.all', middleware: ['auth', 'verified'])]
    public function all(): array
    {
        $user = auth()->user();

        return [
            'notifications' => $user->notifications()->paginate(10)->through(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => class_basename($notification->type),
                    'data' => $notification->data,
                    'read_at' => $notification->read_at,
                    'created_at' => $notification->created_at->diffForHumans(),
                ];
            }),
            'unread_count' => $user->unreadNotifications()->count(),
        ];
    }

    /**
     * Mark a specific notification as read.
     */
    #[Action(method: 'post', name: 'notifications.mark-as-read', middleware: ['auth', 'verified'])]
    public function markAsRead(string $id): JsonResponse
    {
        $notification = DatabaseNotification::findOrFail($id);

        // Check if the notification belongs to the authenticated user
        if ($notification->notifiable_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Mark all notifications as read.
     */
    #[Action(method: 'post', name: 'notifications.mark-all-as-read', middleware: ['auth', 'verified'])]
    public function markAllAsRead(): JsonResponse
    {
        $user = auth()->user();
        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }
}
