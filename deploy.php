<?php

declare(strict_types=1);

namespace Deployer;

use Exception;

require 'recipe/laravel.php';

// Config
set('repository', 'https://github.com/msamgan/work-hours.git');

add('shared_files', []);
add('shared_dirs', []);
add('writable_dirs', []);

// Hosts
host('146.190.32.125')
    ->set('remote_user', 'workhours')
    ->set('deploy_path', '~/htdocs/workhours.us')
    ->set('writable_mode', 'chmod');

try {
    desc('Build the assets');
    task('build', function () {
        cd('{{release_path}}');
        run('npm install');
        run('npm run build');
    });
} catch (Exception $e) {
    writeln('Build task failed: ' . $e->getMessage());
}

try {
    desc('Restart the back process');
    task('pm2', function () {
        cd('{{current_path}}');
        run('pm2 restart ecosystem.config.cjs');
    });
} catch (Exception $e) {
    writeln('PM2 task failed: ' . $e->getMessage());
}

try {
    task('optimize', function () {
        cd('{{current_path}}');
        run('php artisan optimize');
    });
} catch (Exception $e) {
    writeln('Optimize task failed: ' . $e->getMessage());
}

// Hooks
after('deploy:vendors', 'build');
after('deploy:failed', 'deploy:unlock');
after('deploy:success', 'optimize');
after('optimize', 'pm2');
