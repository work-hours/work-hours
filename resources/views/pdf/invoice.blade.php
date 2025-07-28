<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 13.8px; /* Increased by 15% from 12px */
            line-height: 1.4;
            color: #333;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #e0e0e0;
            background-color: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #4a86e8;
            position: relative;
        }
        .header h1 {
            color: #4a86e8;
            font-size: 27.6px; /* Increased by 15% from 24px */
            margin: 0 0 2px 0;
            letter-spacing: 1px;
            text-transform: uppercase;
            font-weight: 700;
        }
        .header h2 {
            font-size: 18.4px; /* Increased by 15% from 16px */
            color: #555;
            margin: 2px 0;
        }
        .invoice-info {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .invoice-info-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .invoice-info-column {
            width: 48%;
        }
        .invoice-info-column h3 {
            color: #4a86e8;
            margin: 0 0 5px 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            font-size: 16.1px; /* Increased by 15% from 14px */
        }
        .invoice-info-column p {
            margin: 5px 0;
            font-size: 13.8px; /* Added to match body font size */
        }
        .invoice-details {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
        }
        .invoice-details p {
            margin: 4px 0;
            font-size: 13.8px; /* Increased by 15% from 12px */
        }
        .invoice-details strong {
            color: #555;
            display: inline-block;
            width: 115px; /* Increased to accommodate larger font size */
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
            border: 1px solid #e0e0e0;
        }
        th {
            padding: 6px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
            background-color: #4a86e8;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12.65px; /* Increased by 15% from 11px */
        }
        td {
            padding: 4px 6px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
            font-size: 12.65px; /* Increased by 15% from 11px */
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .total-row {
            font-weight: bold;
            background-color: #f2f2f2;
            font-size: 14.95px; /* Increased by 15% from 13px */
        }
        .currency {
            font-size: 90%;
            color: #666;
            margin-right: 2px;
        }
        .amount {
            font-family: 'Courier New', monospace;
            white-space: nowrap;
        }
        .notes {
            margin-top: 15px;
            padding: 10px;
            background-color: #f9f9f9;
            border-radius: 4px;
            border-left: 3px solid #4a86e8;
        }
        .notes h3 {
            color: #4a86e8;
            margin: 0 0 5px 0;
            font-size: 14.95px; /* Increased by 15% from 13px */
        }
        .notes p {
            margin: 5px 0;
            font-size: 12.65px; /* Increased by 15% from 11px */
        }
        .footer {
            margin-top: 15px;
            text-align: center;
            font-size: 12.65px; /* Increased by 15% from 11px */
            color: #777;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 2px 0;
        }
        .status-stamp {
            position: absolute;
            top: 100px;
            right: 50px;
            transform: rotate(-15deg);
            font-size: 41.4px; /* Increased by 15% from 36px */
            font-weight: bold;
            text-transform: uppercase;
            padding: 8px 16px;
            border: 4px solid;
            border-radius: 8px;
            opacity: 0.7;
            text-align: center;
            z-index: 100;
            letter-spacing: 2px;
        }
        .stamp-paid {
            color: #28a745;
            border-color: #28a745;
        }
        .stamp-unpaid {
            color: #fd7e14;
            border-color: #fd7e14;
        }
        .stamp-overdue {
            color: #dc3545;
            border-color: #dc3545;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>INVOICE</h1>
            <h2>#{{ $invoice->invoice_number }}</h2>
        </div>

        <div class="invoice-info">
            <div class="invoice-info-row">
                <div class="invoice-info-column">
                    <h3>From:</h3>
                    <p>{{ $invoice->user->name }}<br>
                    {{ $invoice->user->email }}</p>
                </div>
                <div class="invoice-info-column">
                    <h3>To:</h3>
                    <p>{{ $client->name }}<br>
                    {{ $client->email ?? '' }}<br>
                    {{ $client->address ?? '' }}</p>
                </div>
            </div>
        </div>

        <div class="invoice-details">
            <p><strong>Issue Date:</strong> {{ $invoice->issue_date->format('Y-m-d') }}</p>
            <p><strong>Due Date:</strong> {{ $invoice->due_date->format('Y-m-d') }}</p>
            <p><strong>Currency:</strong> {{ $invoice->currency ?? $client->currency ?? 'USD' }}</p>
        </div>

        @php
            // Determine which stamp to show based on invoice status
            // Only show PAID, UNPAID, or OVERDUE as requested
            $statusClass = '';
            $statusText = '';

            if ($invoice->status->value === 'paid' || ($invoice->status->value === 'partially_paid' && $invoice->paid_amount >= $invoice->total_amount)) {
                $statusClass = 'stamp-paid';
                $statusText = 'PAID';
            } elseif ($invoice->status->value === 'overdue') {
                $statusClass = 'stamp-overdue';
                $statusText = 'OVERDUE';
            } else {
                // All other statuses (draft, sent, partially_paid with partial payment, cancelled) show as UNPAID
                $statusClass = 'stamp-unpaid';
                $statusText = 'UNPAID';
            }
        @endphp

        <div class="status-stamp {{ $statusClass }}">
            {{ $statusText }}
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td class="amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($item->unit_price, 2) }}
                    </td>
                    <td class="amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($item->amount, 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                    <td class="amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->total_amount + $invoice->discount_amount, 2) }}
                    </td>
                </tr>
                @if($invoice->discount_amount > 0)
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Discount:</strong></td>
                    <td class="amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->discount_amount, 2) }}
                    </td>
                </tr>
                @endif
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                    <td class="amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->total_amount, 2) }}
                    </td>
                </tr>
                @if($invoice->paid_amount > 0)
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Paid:</strong></td>
                    <td class="amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->paid_amount, 2) }}
                    </td>
                </tr>
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;"><strong>Balance Due:</strong></td>
                    <td class="amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->total_amount - $invoice->paid_amount, 2) }}
                    </td>
                </tr>
                @endif
            </tfoot>
        </table>

        @if($invoice->notes)
        <div class="notes">
            <h3>Notes</h3>
            <p>{{ $invoice->notes }}</p>
        </div>
        @endif

        <div class="footer">
            <p>Thank you for your business! | Invoice generated on {{ date('Y-m-d') }} | Powered by <strong>workhours.us</strong></p>
        </div>
    </div>
</body>
</html>
