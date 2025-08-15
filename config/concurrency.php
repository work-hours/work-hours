<?php

declare(strict_types=1);

return [
    // The default concurrency driver. Supported: "process", "fork", "sync"
    'default' => env('CONCURRENCY_DRIVER', 'process'),
];
