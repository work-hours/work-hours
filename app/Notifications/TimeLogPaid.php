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
        ];
    }

    private function messageFormatter(): string
    {
        return sprintf(
            'Time log for %s on %s with duration %s hours has been marked as paid by %s.',
            $this->timeLog->project->name,
            $this->timeLog->created_at->format('Y-m-d H:i:s'),
            $this->timeLog->duration,
            $this->actor->name
        );
    }
}
