<?php

declare(strict_types=1);

namespace App\Imports;

use App\Models\Project;
use App\Models\TimeLog;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class TimeLogImport implements ToCollection, WithHeadingRow, WithValidation
{
    private array $projects;
    private array $errors = [];
    private int $successCount = 0;

    public function __construct()
    {
        // Get all projects that the user has access to
        $this->projects = Project::query()
            ->where('user_id', Auth::id())
            ->orWhereHas('teamMembers', function ($query) {
                $query->where('member_id', Auth::id());
            })
            ->pluck('id', 'name')
            ->toArray();
    }

    public function collection(Collection $rows): void
    {
        foreach ($rows as $index => $row) {
            if (empty($row['project']) || empty($row['start_timestamp']) || empty($row['note'])) {
                $this->errors[] = "Row #" . ($index + 2) . ": Missing required fields.";
                continue;
            }

            $projectName = trim($row['project']);
            $projectId = array_search($projectName, array_flip($this->projects));

            if (!$projectId) {
                $this->errors[] = "Row #" . ($index + 2) . ": Project '{$projectName}' not found or you don't have access to it.";
                continue;
            }

            try {
                $startTimestamp = Carbon::parse($row['start_timestamp']);
                $endTimestamp = !empty($row['end_timestamp']) ? Carbon::parse($row['end_timestamp']) : null;

                $duration = null;
                if ($startTimestamp && $endTimestamp) {
                    $duration = round(abs($startTimestamp->diffInMinutes($endTimestamp)) / 60, 2);
                }

                TimeLog::query()->create([
                    'user_id' => Auth::id(),
                    'project_id' => $projectId,
                    'start_timestamp' => $startTimestamp,
                    'end_timestamp' => $endTimestamp,
                    'duration' => $duration,
                    'is_paid' => false,
                    'note' => $row['note'],
                ]);

                $this->successCount++;
            } catch (\Exception $e) {
                $this->errors[] = "Row #" . ($index + 2) . ": " . $e->getMessage();
            }
        }
    }

    /**
     * Get validation rules
     */
    public function rules(): array
    {
        return [
            '*.project' => ['required', 'string'],
            '*.start_timestamp' => ['required', 'date'],
            '*.end_timestamp' => ['nullable', 'date', 'after_or_equal:*.start_timestamp'],
            '*.note' => ['required', 'string'],
        ];
    }

    /**
     * Get custom validation messages
     */
    public function customValidationMessages(): array
    {
        return [
            '*.project.required' => 'Project is required.',
            '*.start_timestamp.required' => 'Start timestamp is required.',
            '*.start_timestamp.date' => 'Start timestamp must be a valid date.',
            '*.end_timestamp.date' => 'End timestamp must be a valid date.',
            '*.end_timestamp.after_or_equal' => 'End timestamp must be after or equal to start timestamp.',
            '*.note.required' => 'Note is required.',
        ];
    }

    /**
     * Get import errors
     */
    public function getErrors(): array
    {
        return $this->errors;
    }

    /**
     * Get success count
     */
    public function getSuccessCount(): int
    {
        return $this->successCount;
    }
}
