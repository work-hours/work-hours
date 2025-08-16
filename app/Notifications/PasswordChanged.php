<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

final class PasswordChanged extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        private readonly User $user,
        private readonly User $updatedBy,
        private readonly ?string $plainPassword = null
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
        $mailMessage = (new MailMessage)
            ->subject('Your Password Has Been Changed')
            ->greeting('Hello ' . $this->user->name . '!')
            ->line('Your password has been changed by ' . $this->updatedBy->name . '.');

        if ($this->plainPassword) {
            $mailMessage->line('Your new password is: ' . $this->plainPassword)
                ->line('Please keep this password secure and consider changing it after your first login.');
        }

        return $mailMessage
            ->line('If you did not request this change, please contact your team administrator immediately.')
            ->action('Login to Your Account', url('/login'))
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
            'user_id' => $this->user->id,
            'updated_by_id' => $this->updatedBy->id,
        ];
    }

    private function messageFormatter(): string
    {
        return sprintf(
            'Your password has been changed by %s.',
            $this->updatedBy->name
        );
    }
}
