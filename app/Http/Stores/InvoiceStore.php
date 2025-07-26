<?php

declare(strict_types=1);

namespace App\Http\Stores;

use App\Enums\InvoiceStatus;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pipeline\Pipeline;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class InvoiceStore
{
    /**
     * Get invoices for a specific user
     */
    public static function userInvoices(int $userId): Collection
    {
        $query = Invoice::query()
            ->where('user_id', $userId)
            ->with(['client'])
            ->orderByDesc('created_at');

        return self::applyFilterPipeline($query)->get();
    }

    /**
     * Get invoices for a specific client
     */
    public static function clientInvoices(Client $client): Collection
    {
        return $client->invoices()
            ->with(['client', 'user'])
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Create a new invoice with items
     */
    public static function createInvoice(array $data, int $userId): Invoice
    {
        return DB::transaction(function () use ($data, $userId) {
            // Set default values
            $data['user_id'] = $userId;
            $data['status'] ??= InvoiceStatus::DRAFT->value;
            $data['total_amount'] = 0;
            $data['paid_amount'] = 0;

            // Extract items before creating invoice
            $items = $data['items'] ?? [];
            unset($data['items']);

            // Create invoice
            $invoice = Invoice::query()->create($data);

            // Create invoice items if provided
            if (!empty($items) && is_array($items)) {
                self::createInvoiceItems($invoice, $items);
            }

            // Update invoice total
            self::updateInvoiceTotal($invoice);

            return $invoice->fresh(['items']);
        });
    }

    /**
     * Update an existing invoice and its items
     */
    public static function updateInvoice(Invoice $invoice, array $data): Invoice
    {
        return DB::transaction(function () use ($invoice, $data) {
            // Extract items before updating invoice
            $items = $data['items'] ?? [];
            unset($data['items']);

            // Update invoice
            $invoice->update($data);

            // Update invoice items if provided
            if (!empty($items) && is_array($items)) {
                self::updateInvoiceItems($invoice, $items);
            }

            // Update invoice total
            self::updateInvoiceTotal($invoice);

            // Update time logs if invoice is paid
            if ($invoice->status === InvoiceStatus::PAID) {
                self::markTimeLogsPaid($invoice);
            }

            return $invoice->fresh(['items']);
        });
    }

    /**
     * Map invoice data for export
     */
    public static function invoiceExportMapper(Collection $invoices): Collection
    {
        return $invoices->map(fn ($invoice): array => [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'client' => $invoice->client->name,
            'issue_date' => Carbon::parse($invoice->issue_date)->toDateString(),
            'due_date' => Carbon::parse($invoice->due_date)->toDateString(),
            'discount_type' => $invoice->discount_type,
            'discount_value' => $invoice->discount_value,
            'discount_amount' => $invoice->discount_amount,
            'total_amount' => $invoice->total_amount,
            'paid_amount' => $invoice->paid_amount,
            'status' => $invoice->status,
            'created_at' => Carbon::parse($invoice->created_at)->toDateTimeString(),
        ]);
    }

    /**
     * Create invoice items
     */
    private static function createInvoiceItems(Invoice $invoice, array $items): void
    {
        foreach ($items as $item) {
            $item['invoice_id'] = $invoice->id;
            InvoiceItem::query()->create($item);

            // If item is linked to a time log, update the time log
            if (isset($item['time_log_id']) && $invoice->status === InvoiceStatus::PAID) {
                TimeLog::query()->where('id', $item['time_log_id'])->update(['is_paid' => true]);
            }
        }
    }

    /**
     * Update invoice items
     */
    private static function updateInvoiceItems(Invoice $invoice, array $items): void
    {
        // Get existing item IDs
        $existingItemIds = $invoice->items->pluck('id')->toArray();
        $updatedItemIds = [];

        foreach ($items as $item) {
            if (isset($item['id'])) {
                // Update existing item
                $invoiceItem = InvoiceItem::query()->find($item['id']);
                if ($invoiceItem && $invoiceItem->invoice_id === $invoice->id) {
                    $invoiceItem->update($item);
                    $updatedItemIds[] = $invoiceItem->id;
                }
            } else {
                // Create new item
                $item['invoice_id'] = $invoice->id;
                $newItem = InvoiceItem::query()->create($item);
                $updatedItemIds[] = $newItem->id;
            }
        }

        // Delete items that were not updated
        $itemsToDelete = array_diff($existingItemIds, $updatedItemIds);
        if ($itemsToDelete !== []) {
            InvoiceItem::query()->whereIn('id', $itemsToDelete)->delete();
        }
    }

    /**
     * Update invoice total amount with discount
     */
    private static function updateInvoiceTotal(Invoice $invoice): void
    {
        // Calculate subtotal (sum of all item amounts)
        $subtotal = $invoice->items()->sum('amount');

        // Calculate discount amount based on discount type and value
        $discountAmount = 0;
        if ($invoice->discount_type && $invoice->discount_value > 0) {
            if ($invoice->discount_type === 'percentage') {
                // Calculate percentage discount
                $discountAmount = ($subtotal * $invoice->discount_value) / 100;
            } elseif ($invoice->discount_type === 'fixed') {
                // Apply fixed discount
                $discountAmount = $invoice->discount_value;

                // Ensure discount doesn't exceed subtotal
                if ($discountAmount > $subtotal) {
                    $discountAmount = $subtotal;
                }
            }
        }

        // Calculate final total after discount
        $total = $subtotal - $discountAmount;

        // Update invoice with new total and discount amount
        $invoice->update([
            'total_amount' => $total,
            'discount_amount' => $discountAmount
        ]);
    }

    /**
     * Mark time logs as paid when invoice is paid
     */
    private static function markTimeLogsPaid(Invoice $invoice): void
    {
        $timeLogIds = $invoice->items()
            ->whereNotNull('time_log_id')
            ->pluck('time_log_id')
            ->toArray();

        if (! empty($timeLogIds)) {
            TimeLog::query()->whereIn('id', $timeLogIds)->update(['is_paid' => true]);
        }
    }

    /**
     * Apply query filters using pipeline
     */
    private static function applyFilterPipeline(Builder $query): Builder
    {
        return app(Pipeline::class)
            ->send($query)
            ->through([
                // Add filters here when created
            ])
            ->thenReturn();
    }
}
