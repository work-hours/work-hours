<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\InvoiceStatus;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Class Invoice
 *
 * @property int $id
 * @property int $user_id
 * @property int $client_id
 * @property string $invoice_number
 * @property Carbon $issue_date
 * @property Carbon $due_date
 * @property float $total_amount
 * @property float $paid_amount
 * @property string $status
 * @property string|null $notes
 * @property string|null $discount_type
 * @property float $discount_value
 * @property float $discount_amount
 * @property string|null $tax_type
 * @property float $tax_rate
 * @property float $tax_amount
 * @property string|null $currency
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property User $user
 * @property Client $client
 * @property Collection|InvoiceItem[] $items
 */
final class Invoice extends Model
{
    protected $fillable = [
        'user_id',
        'client_id',
        'invoice_number',
        'issue_date',
        'due_date',
        'total_amount',
        'paid_amount',
        'status',
        'notes',
        'discount_type',
        'discount_value',
        'discount_amount',
        'tax_type',
        'tax_rate',
        'tax_amount',
        'currency',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
            'due_date' => 'date',
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'discount_value' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_rate' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'status' => InvoiceStatus::class,
        ];
    }
}
