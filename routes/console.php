<?php

declare(strict_types=1);

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Illuminate\Support\Facades\Schedule::command('tasks:recur daily')->daily();
Illuminate\Support\Facades\Schedule::command('tasks:recur weekly')->daily();
Illuminate\Support\Facades\Schedule::command('tasks:recur every_other_week')->daily();
Illuminate\Support\Facades\Schedule::command('tasks:recur monthly')->daily();
