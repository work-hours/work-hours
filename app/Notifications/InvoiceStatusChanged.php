<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

final class InvoiceStatusChanged extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly Invoice $invoice)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject($this->getSubject())
            ->line($this->getIntroLine())
            ->line("Invoice Number: {$this->invoice->invoice_number}")
            ->line("Issue Date: {$this->invoice->issue_date->format('Y-m-d')}")
            ->line("Due Date: {$this->invoice->due_date->format('Y-m-d')}")
            ->line("Total Amount: {$this->invoice->total_amount}")
            ->action('View Invoice', url('/invoices/' . $this->invoice->id))
            ->line('Thank you for your business!');

        $pdf = $this->generateInvoicePdf();

        if ($pdf instanceof \Barryvdh\DomPDF\PDF) {
            $message->attachData(
                $pdf->output(),
                "Invoice_{$this->invoice->invoice_number}.pdf",
                ['mime' => 'application/pdf']
            );
        }

        return $message;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->getIntroLine(),
            'invoice_id' => $this->invoice->id,
            'invoice_number' => $this->invoice->invoice_number,
            'status' => $this->invoice->status->value,
        ];
    }

    /**
     * Get the subject for the notification.
     */
    private function getSubject(): string
    {
        return match ($this->invoice->status) {
            InvoiceStatus::SENT => "Invoice #{$this->invoice->invoice_number} has been sent",
            InvoiceStatus::OVERDUE => "Invoice #{$this->invoice->invoice_number} is overdue",
            default => "Invoice #{$this->invoice->invoice_number} status update",
        };
    }

    /**
     * Get the intro line for the notification.
     */
    private function getIntroLine(): string
    {
        return match ($this->invoice->status) {
            InvoiceStatus::SENT => "Your invoice #{$this->invoice->invoice_number} has been sent and is now due for payment.",
            InvoiceStatus::OVERDUE => "Your invoice #{$this->invoice->invoice_number} is now overdue. Please make payment as soon as possible.",
            default => "Your invoice #{$this->invoice->invoice_number} status has been updated to {$this->invoice->status->value}.",
        };
    }

    /**
     * Generate a PDF for the invoice.
     */
    private function generateInvoicePdf(): ?\Barryvdh\DomPDF\PDF
    {
        try {

            if (! class_exists(Pdf::class)) {
                return null;
            }

            return Pdf::loadView('pdf.invoice', [
                'invoice' => $this->invoice,
                'client' => $this->invoice->client,
                'items' => $this->invoice->items,
            ]);

        } catch (Exception $e) {

            Log::error('Failed to generate invoice PDF: ' . $e->getMessage());

            return null;
        }
    }
}
