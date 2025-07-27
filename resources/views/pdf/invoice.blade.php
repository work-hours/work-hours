<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .invoice-info-box {
            width: 45%;
        }
        .invoice-details {
            margin-bottom: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f2f2f2;
        }
        .total-row {
            font-weight: bold;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
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
            <div class="invoice-info-box">
                <h3>From:</h3>
                <p>{{ $invoice->user->name }}<br>
                {{ $invoice->user->email }}</p>
            </div>
            <div class="invoice-info-box">
                <h3>To:</h3>
                <p>{{ $client->name }}<br>
                {{ $client->email ?? '' }}<br>
                {{ $client->address ?? '' }}</p>
            </div>
        </div>

        <div class="invoice-details">
            <p><strong>Issue Date:</strong> {{ $invoice->issue_date->format('Y-m-d') }}</p>
            <p><strong>Due Date:</strong> {{ $invoice->due_date->format('Y-m-d') }}</p>
            <p><strong>Status:</strong> {{ ucfirst($invoice->status->value) }}</p>
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
                    <td>{{ $item->rate }}</td>
                    <td>{{ $item->amount }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                    <td>{{ $invoice->total_amount + $invoice->discount_amount }}</td>
                </tr>
                @if($invoice->discount_amount > 0)
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Discount:</strong></td>
                    <td>{{ $invoice->discount_amount }}</td>
                </tr>
                @endif
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                    <td>{{ $invoice->total_amount }}</td>
                </tr>
                @if($invoice->paid_amount > 0)
                <tr>
                    <td colspan="3" style="text-align: right;"><strong>Paid:</strong></td>
                    <td>{{ $invoice->paid_amount }}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="3" style="text-align: right;"><strong>Balance Due:</strong></td>
                    <td>{{ $invoice->total_amount - $invoice->paid_amount }}</td>
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
        </div>
    </div>
</body>
</html>
