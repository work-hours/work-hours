<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class TaskCompleted extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly Task $task,
        private readonly User $completer
    ) {}

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
            ->subject('Your Task Has Been Completed')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your task "' . $this->task->title . '" has been marked as completed by ' . $this->completer->name . '.')
            ->line('Project: ' . $this->task->project->name)
            ->line('Priority: ' . $this->task->priority)
            ->when($this->task->due_date, fn (MailMessage $message) => $message->line('Due Date: ' . $this->task->due_date->format('Y-m-d')))
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
            'completer_id' => $this->completer->id,
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
        ];
    }

    private function messageFormatter(): string
    {
        return sprintf(
            'Your task "%s" has been marked as completed by %s.',
            $this->task->title,
            $this->completer->name
        );
    }
}
