<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Enums\InvoiceStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

final class UpdateInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'client_id' => ['sometimes', 'required', 'exists:clients,id'],
            'invoice_number' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('invoices', 'invoice_number')->ignore($this->invoice),
            ],
            'issue_date' => ['sometimes', 'required', 'date'],
            'due_date' => ['sometimes', 'required', 'date', 'after_or_equal:issue_date'],
            'status' => ['sometimes', new Enum(InvoiceStatus::class)],
            'paid_amount' => ['sometimes', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'discount_type' => ['sometimes', 'nullable', 'in:percentage,fixed'],
            'discount_value' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'currency' => ['sometimes', 'nullable', 'string', 'max:10'],
            'items' => ['sometimes', 'array'],
            'items.*.id' => ['sometimes', 'exists:invoice_items,id'],
            'items.*.time_log_id' => ['nullable', 'exists:time_logs,id'],
            'items.*.description' => ['required', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.amount' => ['required', 'numeric', 'min:0'],
        ];
    }
}
