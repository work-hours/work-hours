<?php

declare(strict_types=1);

namespace App\Traits;

use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

trait ExportableTrait
{
    /**
     * Export data to CSV
     *
     * @param  Collection  $data  The data to export
     * @param  array  $headers  The headers for the CSV file
     * @param  string  $filename  The name of the file to download
     */
    public function exportToCsv(Collection $data, array $headers, string $filename): StreamedResponse
    {
        $callback = function () use ($data, $headers): void {
            $file = fopen('php://output', 'w');

            fputcsv($file, $headers);

            foreach ($data as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        };

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream($callback, 200, $headers);
    }
}
