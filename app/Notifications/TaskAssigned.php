<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class TaskAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly Task $task,
        private readonly User $assigner
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
            ->subject('You\'ve Been Assigned to a Task')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You have been assigned to a task "' . $this->task->title . '" by ' . $this->assigner->name . '.')
            ->line('Project: ' . $this->task->project->name)
            ->line('Status: ' . $this->task->status)
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
            'assigner_id' => $this->assigner->id,
            'task_id' => $this->task->id,
            'project_id' => $this->task->project_id,
        ];
    }

    private function messageFormatter(): string
    {
        return sprintf(
            'You have been assigned to task "%s" by %s.',
            $this->task->title,
            $this->assigner->name
        );
    }
}
