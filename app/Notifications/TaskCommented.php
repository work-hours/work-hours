<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Task;
use App\Models\TaskComment;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class TaskCommented extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly Task $task,
        private readonly TaskComment $comment,
        private readonly User $commenter
    ) {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Comment on Task')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line($this->messageFormatter())
            ->when($this->task->project, fn (MailMessage $message) => $message->line('Project: ' . $this->task->project->name))
            ->action('View Task', url('/tasks/' . $this->task->id))
            ->line('Thank you for using WorkHours!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->messageFormatter(),
            'commenter_id' => $this->commenter->id,
            'comment_id' => $this->comment->id,
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
        ];
    }

    private function messageFormatter(): string
    {
        return sprintf(
            'New comment on task "%s" by %s.',
            $this->task->title,
            $this->commenter->name
        );
    }
}
