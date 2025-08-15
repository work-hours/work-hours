<?php

declare(strict_types=1);

namespace App\Providers;

use App\Events\TaskCreated;
use App\Events\TaskUpdated;
use App\Listeners\TaskCreatedListener;
use App\Listeners\TaskUpdatedListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

final class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        TaskCreated::class => [
            TaskCreatedListener::class,
        ],
        TaskUpdated::class => [
            TaskUpdatedListener::class,
        ],
    ];
}
