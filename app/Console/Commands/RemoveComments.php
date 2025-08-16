<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use RegexIterator;
use Symfony\Component\Console\Command\Command as CommandAlias;

final class RemoveComments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remove-comments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove all comments from the codebase';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $appPath = base_path('app');
        $this->info("Removing comments from PHP files in {$appPath}");

        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($appPath));
        $filteredPhpFiles = new RegexIterator($files, '/\.php$/');

        ['totalFiles' => $totalFiles, 'modifiedFiles' => $modifiedFiles] = $this->removals($filteredPhpFiles);

        $tsxFilePath = base_path('resources/js');
        $this->info("Removing comments from TSX files in {$tsxFilePath}");
        $tsxFiles = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($tsxFilePath));
        $filteredTsxFiles = new RegexIterator($tsxFiles, '/\.tsx$/');

        ['totalFiles' => $tsxTotalFiles, 'modifiedFiles' => $tsxModifiedFiles] = $this->removals($filteredTsxFiles);

        $totalFiles += $tsxTotalFiles;
        $modifiedFiles += $tsxModifiedFiles;

        $this->info("Processed {$totalFiles} files. Modified {$modifiedFiles} files.");

        return CommandAlias::SUCCESS;
    }

    private function removals(RegexIterator $filteredFiles): array
    {
        $totalFiles = 0;
        $modifiedFiles = 0;

        foreach ($filteredFiles as $file) {
            $totalFiles++;
            $filePath = $file->getRealPath();
            $code = file_get_contents($filePath);
            $newCode = $code;

            $extension = pathinfo((string) $filePath, PATHINFO_EXTENSION);

            if ($extension === 'tsx') {
                $newCode = preg_replace('/^\s*\/\/.*$\n?/m', '', $code);
                $newCode = preg_replace('/^[^\S\n]*{\s*\/\*.*?\*\/\s*}[^\S\n]*$\n?/ms', '', (string) $newCode);
                $newCode = preg_replace('/{\s*\/\*.*?\*\/\s*}/s', '', (string) $newCode);
            } else {
                $newCode = preg_replace('/^\s*\/\/.*$\n?/m', '', $code);
            }

            if ($newCode !== null && $newCode !== $code) {
                file_put_contents($filePath, $newCode);
                $modifiedFiles++;
                $this->info("Comments removed from: {$filePath}");
            }
        }

        return [
            'totalFiles' => $totalFiles,
            'modifiedFiles' => $modifiedFiles,
        ];
    }
}
