<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class UpdateTimeLogRequest extends FormRequest
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
            'project_id' => ['required', 'exists:projects,id'],
            'task_id' => ['nullable', 'exists:tasks,id'],
            'start_timestamp' => ['required', 'date'],
            'end_timestamp' => ['required', 'date', 'after_or_equal:start_timestamp'],
            'note' => ['required_without:task_id', 'string', 'nullable'],
            'non_billable' => ['boolean', 'nullable'],
            'mark_task_complete' => ['boolean', 'nullable'],
            'close_github_issue' => ['boolean', 'nullable'],
            'mark_jira_done' => ['boolean', 'nullable'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
