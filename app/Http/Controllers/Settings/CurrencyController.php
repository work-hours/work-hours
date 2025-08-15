<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\CurrencyStoreRequest;
use App\Models\Currency;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class CurrencyController extends Controller
{
    /**
     * Show the currency settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/currency', [
            'currencies' => $request->user()->currencies,
        ]);
    }

    /**
     * Store a new currency.
     */
    public function store(CurrencyStoreRequest $request): RedirectResponse
    {
        $request->user()->currencies()->create($request->validated());

        return to_route('currency.edit');
    }

    /**
     * Delete a currency.
     */
    public function destroy(Request $request, Currency $currency): RedirectResponse
    {
        abort_if($currency->user_id !== $request->user()->id, 403);

        $currencyCount = $request->user()->currencies()->count();
        if ($currencyCount <= 1) {
            return back()->withErrors(['currency' => 'You cannot delete your last currency. At least one currency is required.']);
        }

        $currency->delete();

        return to_route('currency.edit');
    }
}
