<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class TeamMemberCreated extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly User $member,
        private readonly User $creator,
        private readonly ?string $password = null
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
        $mailMessage = (new MailMessage)
            ->subject('Welcome to the Team!')
            ->greeting('Hello ' . $this->member->name . '!')
            ->line('You have been added to ' . $this->creator->name . '\'s team in WorkHours.')
            ->line('Here is your login information:')
            ->line('Email: ' . $this->member->email);

        if ($this->password) {
            $mailMessage->line('Password: ' . $this->password)
                ->line('Please change your password after your first login for security reasons.');
        }

        return $mailMessage
            ->action('Login Now', url('/login'))
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
