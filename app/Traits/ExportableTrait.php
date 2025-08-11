<?php

declare(strict_types=1);

namespace App\Traits;

use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
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

        Log::info('Exporting CSV with ' . $data->count() . ' rows');

        $callback = function () use ($data, $headers): void {
            $file = fopen('php://output', 'w');

            fputcsv($file, $headers);

            if ($data->isEmpty()) {
                Log::warning('Exporting CSV with empty data collection');
            }

            foreach ($data as $row) {
                try {
                    fputcsv($file, $row);
                } catch (Exception $e) {
                    Log::error('Error writing CSV row: ' . $e->getMessage(), ['row' => $row]);
                }
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
