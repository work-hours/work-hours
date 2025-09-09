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
        return Inertia::render('expense/index');
    }

    public function create(): Response
    {
        return Inertia::render('expense/create');
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
                'receipt_url' => $expense->receipt_path ? Storage::disk('public')->url($expense->receipt_path) : null,
            ],
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
        ];

        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
            $data['receipt_path'] = $path;
        }

        $expense->update($data);
    }
}
