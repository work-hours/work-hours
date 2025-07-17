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
                $this->errors[] = "Row #" . ($index + 2) . ": Missing required fields.";
                continue;
            }

            $projectName = trim($row['project']);
            $projectId = array_search($projectName, $this->projects, true);

            if (!$projectId) {
                $this->errors[] = "Row #" . ($index + 2) . ": Project '{$projectName}' not found or you don't have access to it.";
                continue;
            }

            $validator = Validator::make($row, [
                'project' => ['required', Rule::in(array_keys($this->projects))],
                'start_timestamp' => ['required', 'date_format:Y-m-d H:i:s'],
                'end_timestamp' => ['required', 'date_format:Y-m-d H:i:s', 'after:start_timestamp'],
                'note' => ['required', 'string', 'max:255'],
            ], [
                'end_timestamp.after' => 'End timestamp must be after to start timestamp.',
            ]);

            if ($validator->fails()) {
                $this->errors[] = "Row #" . ($index + 2) . ": " . implode(', ', $validator->errors()->all());
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
