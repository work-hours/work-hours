<?php

declare(strict_types=1);

namespace App\Imports;

use App\Http\Stores\ProjectStore;
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
    private int $currentRowIndex = 0;

    public function __construct()
    {
        $this->projects = ProjectStore::userProjects(userId: auth()->id())
            ->pluck('name', 'id')
            ->toArray();
    }

    public function collection(Collection $collection): void
    {
        foreach ($collection as $index => $row) {
            $this->currentRowIndex = $index + 2; // +2 because of the header row and 0-based index
            if (empty($row['project']) || empty($row['start_timestamp']) || empty($row['note'])) {
                $this->errors[] = "Row #" . ($index + 2) . ": Missing required fields.";
                continue;
            }

            $projectName = trim($row['project']);
            $projectId = array_search($projectName, $this->projects, true);

            if (!$projectId) {
                $this->errors[] = "Row #" . ($index + 2) . ": Project '{$projectName}' not found or you don't have access to it.";
                continue;
            }

            $validator = Validator::make($row->toArray(), $this->rules(), $this->customValidationMessages());

            if ($validator->fails()) {
                $this->errors[] = implode(', ', $validator->errors()->all());
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
            'project' => ['required', Rule::in(array_values($this->projects))],
            'start_timestamp' => ['required', 'date_format:Y-m-d H:i:s'],
            'end_timestamp' => ['required', 'date_format:Y-m-d H:i:s', 'after:start_timestamp'],
            'note' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom validation messages
     */
    public function customValidationMessages(): array
    {
        $rowPrefix = "Row #{$this->currentRowIndex}: ";

        return [
            'project.required' => $rowPrefix . 'Project is required.',
            'project.in' => $rowPrefix . 'Project not found or you don\'t have access to it.',
            'start_timestamp.required' => $rowPrefix . 'Start timestamp is required.',
            'start_timestamp.date_format' => $rowPrefix . 'Start timestamp must be in Y-m-d H:i:s format.',
            'end_timestamp.required' => $rowPrefix . 'End timestamp is required.',
            'end_timestamp.date_format' => $rowPrefix . 'End timestamp must be in Y-m-d H:i:s format.',
            'end_timestamp.after' => $rowPrefix . 'End timestamp must be after start timestamp.',
            'note.required' => $rowPrefix . 'Note is required.',
            'note.max' => $rowPrefix . 'Note cannot be longer than 255 characters.',
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
