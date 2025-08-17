<?php

declare(strict_types=1);

use App\Adapters\GitHubAdapter;
use App\Services\GitHubRepositoryService;


it('maps github issue state to task status correctly', function () {
    $adapter = new GitHubAdapter();
    $service = new GitHubRepositoryService($adapter);

    expect($service->mapGitHubIssueStatus('closed'))->toBe('completed');
    expect($service->mapGitHubIssueStatus('open'))->toBe('pending');
    expect($service->mapGitHubIssueStatus('unknown'))->toBe('pending');
});

it('computes status and priority from issue payload', function () {
    $adapter = new GitHubAdapter();
    $service = new GitHubRepositoryService($adapter);

    $issueHigh = [
        'state' => 'open',
        'labels' => [
            ['name' => 'High Priority'],
        ],
    ];

    $issueMedium = [
        'state' => 'closed',
        'labels' => [
            ['name' => 'medium'],
        ],
    ];

    $issueLow = [
        'state' => 'open',
        'labels' => [
            ['name' => 'enhancement'],
        ],
    ];

    [$statusH, $priorityH] = $service->computeStatusAndPriority($issueHigh);
    expect($statusH)->toBe('pending')->and($priorityH)->toBe('high');

    [$statusM, $priorityM] = $service->computeStatusAndPriority($issueMedium);
    expect($statusM)->toBe('completed')->and($priorityM)->toBe('medium');

    [$statusL, $priorityL] = $service->computeStatusAndPriority($issueLow);
    expect($statusL)->toBe('pending')->and($priorityL)->toBe('low');
});
