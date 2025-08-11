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
    public function handle()
    {
        $appPath = base_path('app');
        $this->info("Removing comments from PHP files in {$appPath}");

        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($appPath));
        $phpFiles = new RegexIterator($files, '/\.php$/');
        $totalFiles = 0;
        $modifiedFiles = 0;

        foreach ($phpFiles as $file) {
            $totalFiles++;
            $filePath = $file->getRealPath();
            $code = file_get_contents($filePath);
            $newCode = preg_replace('/^\s*\/\/.*$/m', '', $code);

            if ($newCode !== null && $newCode !== $code) {
                file_put_contents($filePath, $newCode);
                $modifiedFiles++;
                $this->info("Comments removed from: {$filePath}");
            }
        }

        $this->info("Processed {$totalFiles} files. Modified {$modifiedFiles} files.");

        return CommandAlias::SUCCESS;
    }
}
