<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class TimeLogPaid extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly TimeLog $timeLog, private readonly User $actor) {}

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
            ->subject('Time Log Paid')
            ->line($this->messageFormatter())
            ->action('View Notifications', url('/notifications'))
            ->line('Thank you for using our application!');
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
            'time_log_id' => $this->timeLog->id,
            'project_id' => $this->timeLog->project_id,
            'project_name' => $this->timeLog->project ? $this->timeLog->project->name : 'No Project',
            'actor_id' => $this->actor->id,
            'actor_name' => $this->actor->name,
        ];
    }

    private function messageFormatter(): string
    {
        return sprintf(
            'Your time log for %s on %s with duration %s hours has been marked as paid by %s.',
            $this->timeLog->project ? $this->timeLog->project->name : 'No Project',
            $this->timeLog->created_at->format('Y-m-d H:i:s'),
            (string) $this->timeLog->duration,
            $this->actor->name
        );
    }
}
