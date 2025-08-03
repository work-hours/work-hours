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
        @font-face {
            font-family: 'Roboto Mono';
            src: url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap');
        }
        body {
            font-family: 'Roboto Mono', monospace;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px 40px;
            border: 1px solid #e0e0e0;
            background-color: #fff;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 15px;
            border-bottom: 2px solid #4a86e8;
            position: relative;
        }
        .header-left {
            text-align: left;
        }
        .header-right {
            text-align: right;
        }
        .header h1 {
            color: #4a86e8;
            font-size: 28px;
            margin: 0;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-weight: 700;
        }
        .header h2 {
            font-size: 20px;
            color: #555;
            margin: 5px 0 0;
            font-weight: 600;
        }
        .invoice-info {
            margin-bottom: 25px;
        }
        .invoice-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .invoice-info-column {
            width: 48%;
        }
        .invoice-info-column h3 {
            color: #4a86e8;
            margin: 0 0 10px 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            font-size: 16px;
            font-weight: 600;
        }
        .invoice-info-column p {
            margin: 5px 0;
            font-size: 14px;
        }
        .invoice-details {
            margin-bottom: 30px;
            padding: 15px 20px;
            background-color: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #4a86e8;
        }
        .invoice-details-grid {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .invoice-details-item {
            min-width: 30%;
            margin-bottom: 5px;
        }
        .invoice-details p {
            margin: 8px 0;
            font-size: 14px;
            line-height: 1.6;
        }
        .invoice-details strong {
            color: #555;
            font-weight: 600;
            display: inline-block;
            width: 100px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            overflow: hidden;
        }
        th {
            padding: 12px 15px;
            text-align: left;
            background-color: #4a86e8;
            color: white;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.5px;
        }
        td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #e0e0e0;
            font-size: 14px;
            vertical-align: middle;
        }
        tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total-row {
            font-weight: bold;
            background-color: #edf2fd !important;
            font-size: 15px;
            border-top: 2px solid #4a86e8;
        }
        .currency {
            color: #666;
            margin-right: 2px;
            font-size: 85%;
        }
        .amount {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            white-space: nowrap;
            font-weight: 500;
        }
        .notes {
            margin-top: 25px;
            margin-bottom: 30px;
            padding: 15px 20px;
            background-color: #f8f9fa;
            border-radius: 6px;
            border-left: 4px solid #4a86e8;
        }
        .notes h3 {
            color: #4a86e8;
            margin: 0 0 10px 0;
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .notes p {
            margin: 8px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #555;
        }
        .footer {
            margin-top: 35px;
            text-align: center;
            font-size: 13px;
            color: #777;
            padding: 15px 0;
            border-top: 1px solid #eee;
        }
        .footer p {
            margin: 2px 0;
        }
        .info-table {
            width: 100%;
            margin-bottom: 30px;
            border: none;
            background-color: transparent;
        }
        .info-cell {
            padding: 0;
            vertical-align: top;
            border: none;
        }
        .info-heading {
            color: #4a86e8;
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-content {
            line-height: 1.6;
        }
        .status-stamp {
            position: absolute;
            top: 50px;
            right: 30px;
            transform: rotate(-15deg);
            font-size: 36px;
            font-weight: 800;
            text-transform: uppercase;
            padding: 8px 25px;
            border: 4px solid;
            border-radius: 10px;
            opacity: 0.9;
            text-align: center;
            z-index: 100;
            letter-spacing: 2px;
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
            <div class="header-left">
                <h1>INVOICE</h1>
                <h2>#{{ $invoice->invoice_number }}</h2>
            </div>
        </div>

        <table class="info-table">
            <tr>
                <td class="info-cell" width="50%">
                    <div class="info-heading">From</div>
                    <div class="info-content">
                        <strong>{{ $invoice->user->name }}</strong><br>
                        {{ $invoice->user->email }}<br>
                        {{ $invoice->user->address ?? '' }}
                    </div>
                </td>
                <td class="info-cell" width="50%" style="text-align: right;">
                    <div class="info-heading">To</div>
                    <div class="info-content">
                        <strong>{{ $client->name }}</strong><br>
                        {{ $client->email ?? '' }}<br>
                        {{ $client->address ?? '' }}
                    </div>
                </td>
            </tr>
        </table>

        <div class="invoice-details">
            <div class="invoice-details-grid">
                <div class="invoice-details-item">
                    <p><strong>Issue Date:</strong> {{ $invoice->issue_date->format('Y-m-d') }}</p>
                </div>
                <div class="invoice-details-item">
                    <p><strong>Due Date:</strong> {{ $invoice->due_date->format('Y-m-d') }}</p>
                </div>
                <div class="invoice-details-item">
                    <p><strong>Currency:</strong> {{ $invoice->currency ?? $client->currency ?? 'USD' }}</p>
                </div>
            </div>
        </div>

        @php
            // Determine which stamp to show based on invoice status
            $statusClass = '';
            $statusText = '';

            if ($invoice->status->value === 'paid' || ($invoice->status->value === 'partially_paid' && $invoice->paid_amount >= $invoice->total_amount)) {
                $statusClass = 'stamp-paid';
                $statusText = 'PAID';
            } elseif ($invoice->status->value === 'overdue') {
                $statusClass = 'stamp-overdue';
                $statusText = 'OVERDUE';
            } else {
                // All other statuses show as UNPAID
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
                    <th width="45%">Description</th>
                    <th width="15%" class="text-center">Quantity</th>
                    <th width="20%" class="text-right">Rate</th>
                    <th width="20%" class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach($items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td class="text-right amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($item->unit_price, 2) }}
                    </td>
                    <td class="text-right amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($item->amount, 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right"><strong>Subtotal:</strong></td>
                    <td class="text-right amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->total_amount + $invoice->discount_amount, 2) }}
                    </td>
                </tr>
                @if($invoice->discount_amount > 0)
                <tr>
                    <td colspan="3" class="text-right"><strong>Discount:</strong></td>
                    <td class="text-right amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->discount_amount, 2) }}
                    </td>
                </tr>
                @endif

                @if($invoice->tax_rate > 0)
                <tr>
                    <td colspan="3" class="text-right">
                        <strong>Tax{{ $invoice->tax_type === 'percentage' ? ' (' . number_format($invoice->tax_rate, 2) . '%)' : '' }}:</strong>
                    </td>
                    <td class="text-right amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format(($invoice->total_amount - $invoice->discount_amount) * ($invoice->tax_rate / 100), 2) }}
                    </td>
                </tr>
                @endif

                <tr class="total-row">
                    <td colspan="3" class="text-right"><strong>Total:</strong></td>
                    <td class="text-right amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->total_amount, 2) }}
                    </td>
                </tr>
                @if($invoice->paid_amount > 0)
                <tr>
                    <td colspan="3" class="text-right"><strong>Paid:</strong></td>
                    <td class="text-right amount">
                        <span class="currency">{{ $invoice->currency ?? $client->currency ?? 'USD' }}</span>
                        {{ number_format($invoice->paid_amount, 2) }}
                    </td>
                </tr>
                <tr class="total-row">
                    <td colspan="3" class="text-right"><strong>Balance Due:</strong></td>
                    <td class="text-right amount">
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
            <p>Thank you for your business!</p>
            <p>Invoice generated on {{ date('Y-m-d') }} | Powered by <strong>workhours.us</strong></p>
        </div>
    </div>
</body>
</html>
