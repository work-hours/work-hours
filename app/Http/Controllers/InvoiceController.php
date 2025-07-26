<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreInvoiceRequest;
use App\Http\Requests\UpdateInvoiceRequest;
use App\Http\Stores\ClientStore;
use App\Http\Stores\InvoiceStore;
use App\Http\Stores\TimeLogStore;
use App\Models\Client;
use App\Models\Invoice;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

final class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $invoices = InvoiceStore::userInvoices(Auth::id());

        return Inertia::render('invoice/index', [
            'invoices' => $invoices,
            'filters' => [
                'search' => request('search', ''),
                'client_id' => request('client_id', ''),
                'status' => request('status', ''),
                'created_date_from' => request('created_date_from', ''),
                'created_date_to' => request('created_date_to', ''),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $clients = ClientStore::userClients(Auth::id());
        $timeLogs = TimeLogStore::unpaidTimeLog(Auth::id());

        return Inertia::render('invoice/create', [
            'clients' => $clients,
            'timeLogs' => $timeLogs,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'invoice.store', middleware: ['auth', 'verified'])]
    public function store(StoreInvoiceRequest $request): void
    {
        DB::beginTransaction();
        try {
            InvoiceStore::createInvoice($request->validated(), Auth::id());
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice): Response
    {
        $clients = ClientStore::userClients(Auth::id());
        $timeLogs = TimeLogStore::unpaidTimeLogs(Auth::id());

        return Inertia::render('invoice/edit', [
            'invoice' => $invoice->load('items.timeLog'),
            'clients' => $clients,
            'timeLogs' => $timeLogs,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'invoice.update', params: ['invoice'], middleware: ['auth', 'verified'])]
    public function update(UpdateInvoiceRequest $request, Invoice $invoice): void
    {
        DB::beginTransaction();
        try {
            InvoiceStore::updateInvoice($invoice, $request->validated());
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'delete', name: 'invoice.destroy', params: ['invoice'], middleware: ['auth', 'verified'])]
    public function destroy(Invoice $invoice): void
    {
        DB::beginTransaction();
        try {
            $invoice->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Display the invoices for the specified client.
     */
    public function clientInvoices(Client $client): Response
    {
        $invoices = InvoiceStore::clientInvoices($client);

        return Inertia::render('invoice/client-invoices', [
            'client' => $client,
            'invoices' => $invoices,
        ]);
    }

    /**
     * Get invoices for the authenticated user
     */
    #[Action(method: 'get', name: 'invoice.list', middleware: ['auth', 'verified'])]
    public function invoices(): Collection
    {
        return InvoiceStore::userInvoices(Auth::id());
    }

    /**
     * Export invoices to CSV
     */
    #[Action(method: 'get', name: 'invoice.export', middleware: ['auth', 'verified'])]
    public function invoiceExport(): StreamedResponse
    {
        $headers = ['ID', 'Invoice Number', 'Client', 'Issue Date', 'Due Date', 'Total Amount', 'Paid Amount', 'Status', 'Created At'];
        $filename = 'invoices_' . Carbon::now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($headers): void {
            $output = fopen('php://output', 'w');
            fputcsv($output, $headers);

            InvoiceStore::invoiceExportMapper(InvoiceStore::userInvoices(Auth::id()))
                ->each(function ($row) use ($output): void {
                    fputcsv($output, $row);
                });

            fclose($output);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    /**
     * Get unpaid time logs grouped by project for a specific client
     */
    #[Action(method: 'get', name: 'getUnpaidTimeLogs', middleware: ['auth', 'verified'])]
    public function getUnpaidTimeLogs(): array
    {
        $clientId = request('client_id');

        if (! $clientId) {
            return [];
        }

        return TimeLogStore::unpaidTimeLogsGroupedByProject((int) $clientId);
    }
}
