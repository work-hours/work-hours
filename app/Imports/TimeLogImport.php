<?php

declare(strict_types=1);

namespace App\Imports;

use App\Http\Stores\ProjectStore;
use App\Models\TimeLog;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

final class TimeLogImport implements ToCollection, WithHeadingRow, WithValidation
{
    private readonly array $projects;

    private array $errors = [];

    private int $successCount = 0;

    public function __construct()
    {
        $this->projects = ProjectStore::userProjects(userId: auth()->id())
            ->pluck('name', 'id')
            ->toArray();
    }

    public function collection(Collection $collection): void
    {
        foreach ($collection as $index => $row) {
            if (empty($row['project']) || empty($row['start_timestamp']) || empty($row['note'])) {
                $this->errors[] = 'Row #' . ($index + 2) . ': Missing required fields.';

                continue;
            }

            $projectName = mb_trim((string) $row['project']);
            $projectId = array_search($projectName, $this->projects, true);

            if (! $projectId) {
                $this->errors[] = 'Row #' . ($index + 2) . ": Project '{$projectName}' not found or you don't have access to it.";

                continue;
            }

            $validator = Validator::make($row->toArray(), $this->rules(), $this->customValidationMessages());

            try {
                $startTimestamp = Carbon::parse($row['start_timestamp']);
                $endTimestamp = empty($row['end_timestamp']) ? null : Carbon::parse($row['end_timestamp']);

                $duration = null;
                if ($endTimestamp instanceof Carbon) {
                    $duration = round(abs($startTimestamp->diffInMinutes($endTimestamp)) / 60, 2);
                }

                // Check for duplicate entries
                $existingEntry = TimeLog::query()
                    ->where('user_id', Auth::id())
                    ->where('project_id', $projectId)
                    ->where('start_timestamp', $startTimestamp)
                    ->where(function ($query) use ($endTimestamp) {
                        if ($endTimestamp === null) {
                            $query->whereNull('end_timestamp');
                        } else {
                            $query->where('end_timestamp', $endTimestamp);
                        }
                    })
                    ->first();

                if ($existingEntry) {
                    $this->errors[] = 'Row #' . ($index + 2) . ': Duplicate entry. A time log with the same project, start time, and end time already exists.';
                    continue;
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
            } catch (Exception $e) {
                $this->errors[] = 'Row #' . ($index + 2) . ': ' . $e->getMessage();
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
        return [
            'project.required' => 'Project is required.',
            'project.in' => 'Project not found or you don\'t have access to it.',
            'start_timestamp.required' => 'Start timestamp is required.',
            'start_timestamp.date_format' => 'Start timestamp must be in Y-m-d H:i:s format.',
            'end_timestamp.required' => 'End timestamp is required.',
            'end_timestamp.date_format' => 'End timestamp must be in Y-m-d H:i:s format.',
            'end_timestamp.after' => 'End timestamp must be after start timestamp.',
            'note.required' => 'Note is required.',
            'note.max' => 'Note cannot be longer than 255 characters.',
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
