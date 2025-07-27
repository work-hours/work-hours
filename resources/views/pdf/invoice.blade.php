<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            background-color: #fff;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4a86e8;
        }
        .header h1 {
            color: #4a86e8;
            font-size: 28px;
            margin-bottom: 5px;
        }
        .header h2 {
            font-size: 20px;
            color: #555;
        }
        .invoice-info {
            margin-bottom: 40px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .invoice-info-row {
            display: flex;
            justify-content: space-between;
        }
        .invoice-info-column {
            width: 48%;
        }
        .invoice-info-column h3 {
            color: #4a86e8;
            margin-top: 0;
            border-bottom: 1px solid #ddd;
            padding-bottom: 8px;
        }
        .invoice-details {
            margin-bottom: 30px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 5px;
        }
        .invoice-details p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #4a86e8;
            color: white;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .total-row {
            font-weight: bold;
            background-color: #f2f2f2;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
            padding-top: 20px;
            border-top: 1px solid #eee;
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
                    <td>{{ $item->unit_price }}</td>
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
            <p>Powered by <strong>workhours.us</strong></p>
        </div>
    </div>
</body>
</html>
