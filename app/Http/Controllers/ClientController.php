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
            'filters' => ClientStore::filters(),
            'currencies' => Auth::user()->currencies,
        ]);
    }

    #[Action(method: 'get', name: 'client.list', middleware: ['auth', 'verified'])]
    public function clients(): Collection
    {
        return ClientStore::userClients(Auth::id());
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

            if (! isset($data['currency']) || empty($data['currency'])) {
                $data['currency'] = 'USD';
            }

            Client::query()->create($data);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
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
            $data = $request->validated();

            if (! isset($data['currency']) || empty($data['currency'])) {
                $data['currency'] = 'USD';
            }

            $client->update($data);
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
        $headers = ClientStore::exportHeaders();
        $filename = 'clients_' . Carbon::now()->format('Y-m-d') . '.csv';

        return $this->exportToCsv(
            ClientStore::clientExportMapper(ClientStore::userClients(Auth::id())),
            $headers,
            $filename
        );
    }
}
