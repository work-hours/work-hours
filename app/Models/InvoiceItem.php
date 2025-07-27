<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class InvoiceItem
 *
 * @property int $id
 * @property int $invoice_id
 * @property int|null $time_log_id
 * @property string $description
 * @property float $quantity
 * @property float $unit_price
 * @property float $amount
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Invoice $invoice
 * @property TimeLog|null $timeLog
 */
final class InvoiceItem extends Model
{
    protected $fillable = [
        'invoice_id',
        'time_log_id',
        'description',
        'quantity',
        'unit_price',
        'amount',
    ];

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function timeLog(): BelongsTo
    {
        return $this->belongsTo(TimeLog::class);
    }

    protected function casts(): array
    {
        return [
            'quantity' => 'decimal:2',
            'unit_price' => 'decimal:2',
            'amount' => 'decimal:2',
        ];
    }
}
