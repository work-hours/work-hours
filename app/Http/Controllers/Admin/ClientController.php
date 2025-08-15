<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ClientController extends Controller
{
    /**
     * Display a listing of all clients.
     */
    public function index(Request $request): Response
    {
        $clients = Client::query()
            ->select(['id', 'name', 'email', 'contact_person', 'phone', 'user_id', 'created_at'])
            ->with(['user:id,name'])
            ->withCount(['projects', 'invoices'])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Clients/Index', [
            'clients' => $clients,
        ]);
    }
}
