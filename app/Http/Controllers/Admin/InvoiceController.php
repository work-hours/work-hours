<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class InvoiceController extends Controller
{
    /**
     * Display a listing of all invoices.
     */
    public function index(Request $request): Response
    {
        $invoices = Invoice::query()
            ->select(['id', 'invoice_number', 'client_id', 'user_id', 'issue_date', 'due_date', 'total_amount', 'paid_amount', 'status', 'created_at'])
            ->with(['client:id,name', 'user:id,name'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }
}
