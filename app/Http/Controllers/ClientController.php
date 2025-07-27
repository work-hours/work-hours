<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Stores\ClientStore;
use App\Models\Client;
use App\Traits\ExportableTrait;
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

final class ClientController extends Controller
{
    use ExportableTrait;

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $clients = ClientStore::userClients(Auth::id());

        return Inertia::render('client/index', [
            'clients' => $clients,
            'filters' => [
                'search' => request('search', ''),
                'created_date_from' => request('created_date_from', ''),
                'created_date_to' => request('created_date_to', ''),
            ],
        ]);
    }

    #[Action(method: 'get', name: 'client.list', middleware: ['auth', 'verified'])]
    public function clients(): Collection
    {
        return ClientStore::userClients(Auth::id());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('client/create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'post', name: 'client.store', middleware: ['auth', 'verified'])]
    public function store(StoreClientRequest $request): void
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $data['user_id'] = Auth::id();

            Client::query()->create($data);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client): Response
    {
        return Inertia::render('client/edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @throws Throwable
     */
    #[Action(method: 'put', name: 'client.update', params: ['client'], middleware: ['auth', 'verified'])]
    public function update(UpdateClientRequest $request, Client $client): void
    {
        DB::beginTransaction();
        try {
            $client->update($request->validated());
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
    #[Action(method: 'delete', name: 'client.destroy', params: ['client'], middleware: ['auth', 'verified'])]
    public function destroy(Client $client): void
    {
        DB::beginTransaction();
        try {
            $client->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Display the projects for the specified client.
     */
    public function projects(Client $client): Response
    {
        $projects = ClientStore::clientProjects($client);

        return Inertia::render('client/projects', [
            'client' => $client,
            'projects' => $projects,
        ]);
    }

    #[Action(method: 'get', params: ['client'], middleware: ['auth', 'verified'])]
    public function clientProjects(Client $client): Collection
    {
        return ClientStore::clientProjects($client);
    }

    /**
     * Export clients to CSV
     */
    #[Action(method: 'get', name: 'client.export', middleware: ['auth', 'verified'])]
    public function clientExport(): StreamedResponse
    {
        $headers = ['ID', 'Name', 'Email', 'Contact Person', 'Phone', 'Address', 'Notes', 'Hourly Rate', 'Currency', 'Created At'];
        $filename = 'clients_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv(
            ClientStore::clientExportMapper(ClientStore::userClients(Auth::id())),
            $headers,
            $filename
        );
    }
}
