<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Msamgan\Lact\Attributes\Action;

final class ExpenseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('expense/index', [
            'filters' => [
                'search' => request('search', ''),
                'created-date-from' => request('created-date-from', ''),
                'created-date-to' => request('created-date-to', ''),
            ],
        ]);
    }

    public function create(): Response
    {
        $currencies = auth()->user()?->currencies()->get(['id', 'code']) ?? collect();

        return Inertia::render('expense/create', [
            'currencies' => $currencies,
        ]);
    }

    public function edit(Expense $expense): Response
    {
        if ($expense->user_id !== Auth::id()) {
            abort(403);
        }

        return Inertia::render('expense/edit', [
            'expense' => [
                'id' => $expense->id,
                'title' => $expense->title,
                'description' => $expense->description,
                'amount' => (float) $expense->amount,
                'currency' => $expense->currency,
                'receipt_url' => $expense->receipt_path ? Storage::disk('public')->url($expense->receipt_path) : null,
            ],
            'currencies' => auth()->user()?->currencies()->get(['id', 'code']) ?? collect(),
        ]);
    }

    #[Action(method: 'post', name: 'expense.store', middleware: ['auth', 'verified'])]
    public function store(StoreExpenseRequest $request): void
    {
        /** @var UploadedFile $file */
        $file = $request->file('receipt');
        $path = $file->store('receipts', 'public');

        Expense::query()->create([
            'user_id' => Auth::id(),
            'title' => $request->string('title')->toString(),
            'description' => $request->string('description')->toString(),
            'amount' => (float) $request->input('amount'),
            'currency' => $request->string('currency')->toString(),
            'receipt_path' => $path,
        ]);
    }

    #[Action(method: 'put', name: 'expense.update', middleware: ['auth', 'verified'])]
    public function update(UpdateExpenseRequest $request, Expense $expense): void
    {
        if ($expense->user_id !== Auth::id()) {
            abort(403);
        }

        $data = [
            'title' => $request->string('title')->toString(),
            'description' => $request->string('description')->toString(),
            'amount' => (float) $request->input('amount'),
            'currency' => $request->string('currency')->toString(),
        ];

        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
            $data['receipt_path'] = $path;
        }

        $expense->update($data);
    }

    /**
     * List expenses for the authenticated user.
     */
    #[Action(method: 'get', name: 'expenses', middleware: ['auth', 'verified'])]
    public function expenses(): \Illuminate\Support\Collection
    {
        return Expense::query()
            ->where('user_id', Auth::id())
            ->when(request('search'), function ($q, $search): void {
                $q->where(function ($qq) use ($search): void {
                    $qq->where('title', 'like', "%$search%")
                        ->orWhere('description', 'like', "%$search%");
                });
            })
            ->when(request('created-date-from'), fn ($q, $from) => $q->whereDate('created_at', '>=', $from))
            ->when(request('created-date-to'), fn ($q, $to) => $q->whereDate('created_at', '<=', $to))
            ->latest()
            ->get()
            ->map(function (Expense $expense) {
                return [
                    'id' => $expense->id,
                    'title' => $expense->title,
                    'description' => $expense->description,
                    'amount' => (float) $expense->amount,
                    'currency' => $expense->currency,
                    'receipt_url' => $expense->receipt_path ? Storage::disk('public')->url($expense->receipt_path) : null,
                    'created_at' => $expense->created_at?->toISOString(),
                ];
            });
    }
}
