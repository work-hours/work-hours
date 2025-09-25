<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Rules\UnauthorizedEmailProviders;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

final class StoreTeamMemberRequest extends FormRequest
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
            'email' => ['required', 'email', 'max:255', new UnauthorizedEmailProviders()],
            'password' => ['required', 'string', 'min:8'],
            'hourly_rate' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:3'],
            'non_monetary' => ['sometimes', 'boolean'],
            'is_employee' => ['sometimes', 'boolean'],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ];
    }

    /**
     * Add conditional validations after initial rules.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $email = (string) ($this->input('email', ''));
            $isEmployee = (bool) $this->boolean('is_employee', false);

            if ($email === '' || $isEmployee === false) {
                return;
            }

            $domain = '';
            $atPos = mb_strrpos($email, '@');
            if ($atPos !== false) {
                $domain = mb_strtolower(mb_substr($email, $atPos + 1));
            }

            $genericDomains = (array) config('generic_email', []);

            if ($domain !== '' && in_array($domain, $genericDomains, true)) {
                $validator->errors()->add('is_employee', 'The is_employee field cannot be selected when using a generic email domain.');
            }
        });
    }
}
