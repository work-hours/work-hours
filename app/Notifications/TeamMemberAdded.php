<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class TeamMemberAdded extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly User $member,
        private readonly User $creator
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
            ->subject('You\'ve Been Added to a Team')
            ->greeting('Hello ' . $this->member->name . '!')
            ->line('You have been added to ' . $this->creator->name . '\'s team in WorkHours.')
            ->line('Since you already have an account, you can log in with your existing credentials.')
            ->action('Go to Dashboard', url('/dashboard'))
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
            'creator_id' => $this->creator->id,
            'member_id' => $this->member->id,
        ];
    }

    private function messageFormatter(): string
    {
        return sprintf(
            'You have been added to %s\'s team in WorkHours.',
            $this->creator->name
        );
    }
}
