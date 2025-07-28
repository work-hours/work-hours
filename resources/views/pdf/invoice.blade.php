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
            font-size: 16px;
            line-height: 1.5;
            color: #333;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 15px;
            border: 1px solid #e0e0e0;
            background-color: #fff;
        }
        .header {
            text-align: center;
            margin-bottom: 18px;
            padding-bottom: 10px;
            border-bottom: 3px solid #4a86e8;
            position: relative;
            background: linear-gradient(to bottom, #f8f9fa, #ffffff);
            padding-top: 15px;
            border-radius: 6px 6px 0 0;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .header h1 {
            color: #4a86e8;
            font-size: 34px; /* Increased for better visibility */
            margin: 0 0 4px 0;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 800;
            text-shadow: 1px 1px 1px rgba(0,0,0,0.1);
        }
        .header h2 {
            font-size: 22px;
            color: #555;
            margin: 4px 0;
            font-weight: 600;
        }
        .invoice-info {
            margin-bottom: 12px;
            padding: 8px;
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
            margin: 0 0 3px 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
            font-size: 18.52px; /* Increased by additional 15% from 16.1px */
        }
        .invoice-info-column p {
            margin: 3px 0;
            font-size: 15.87px; /* Increased by additional 15% from 13.8px */
        }
        .invoice-details {
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border-left: 4px solid #4a86e8;
        }
        .invoice-details p {
            margin: 8px 0;
            font-size: 16px;
            line-height: 1.6;
        }
        .invoice-details strong {
            color: #4a86e8;
            display: inline-block;
            width: 130px;
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        th {
            padding: 10px 12px;
            text-align: left;
            background-color: #4a86e8;
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 16px;
            letter-spacing: 0.5px;
        }
        td {
            padding: 10px 12px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
            font-size: 16px;
            vertical-align: middle;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        tr:hover {
            background-color: #f1f5fd;
        }
        .total-row {
            font-weight: bold;
            background-color: #edf2fd !important;
            font-size: 17px;
            border-top: 2px solid #4a86e8;
        }
        .currency {
            font-size: 90%;
            color: #666;
            margin-right: 2px;
        }
        .amount {
            /* Using the same font as the rest of the document */
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            white-space: nowrap;
        }
        .notes {
            margin-top: 20px;
            margin-bottom: 20px;
            padding: 15px;
            background-color: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #4a86e8;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .notes h3 {
            color: #4a86e8;
            margin: 0 0 8px 0;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .notes p {
            margin: 8px 0;
            font-size: 15px;
            line-height: 1.6;
            color: #555;
        }
        .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 15px;
            color: #777;
            padding: 15px 0;
            border-top: 2px solid #eee;
            background-color: #f8f9fa;
            border-radius: 0 0 6px 6px;
        }
        .footer p {
            margin: 2px 0;
        }
        .info-table {
            width: 100%;
            margin-bottom: 20px;
            border: none;
            background-color: #f8f9fa;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .info-cell {
            padding: 15px;
            vertical-align: top;
            border: none;
        }
        .info-heading {
            color: #4a86e8;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .info-content {
            line-height: 1.6;
        }
        .status-stamp {
            position: absolute;
            top: 100px;
            right: 50px;
            transform: rotate(-15deg);
            font-size: 48px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 10px 20px;
            border: 5px solid;
            border-radius: 12px;
            opacity: 0.8;
            text-align: center;
            z-index: 100;
            letter-spacing: 3px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .stamp-paid {
            color: #28a745;
            border-color: #28a745;
            background-color: rgba(40, 167, 69, 0.05);
        }
        .stamp-unpaid {
            color: #fd7e14;
            border-color: #fd7e14;
            background-color: rgba(253, 126, 20, 0.05);
        }
        .stamp-overdue {
            color: #dc3545;
            border-color: #dc3545;
            background-color: rgba(220, 53, 69, 0.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>INVOICE</h1>
            <h2>#{{ $invoice->invoice_number }}</h2>
        </div>

        <table class="info-table">
            <tr>
                <td class="info-cell">
                    <div class="info-heading">From:</div>
                    <div class="info-content">
                        <strong>{{ $invoice->user->name }}</strong><br>
                        {{ $invoice->user->email }}<br>
                        {{ $invoice->user->address ?? '' }}
                    </div>
                </td>
                <td class="info-cell" style="text-align: right;">
                    <div class="info-heading">To:</div>
                    <div class="info-content">
                        <strong>{{ $client->name }}</strong><br>
                        {{ $client->email ?? '' }}<br>
                        {{ $client->address ?? '' }}
                    </div>
                </td>
            </tr>
        </table>

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
