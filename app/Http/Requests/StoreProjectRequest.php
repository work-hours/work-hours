<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

final class StoreProjectRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'client_id' => ['nullable', 'exists:clients,id'],
            'team_members' => ['nullable', 'array'],
            'team_members.*' => ['exists:users,id'],
            'approvers' => ['nullable', 'array'],
            'approvers.*' => ['exists:users,id'],
            'team_member_rates' => ['nullable', 'array'],
            'team_member_rates.*.hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'team_member_rates.*.currency' => ['nullable', 'string', 'size:3', Rule::in(auth()->user()?->currencies?->pluck('code')->all() ?? [])],
        ];
    }
}
