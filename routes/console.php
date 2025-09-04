<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Schedule;

Schedule::command('tasks:recur daily')->daily();
Schedule::command('tasks:recur weekly')->daily();
Schedule::command('tasks:recur every_other_week')->daily();
Schedule::command('tasks:recur monthly')->daily();
