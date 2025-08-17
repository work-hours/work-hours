<?php

declare(strict_types=1);

use App\Adapters\JiraAdapter;
use App\Models\Credential;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskMeta;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('marks a Jira issue as done and updates meta', function (): void {
    Http::fake([
        'https://*.atlassian.net/rest/api/3/issue/ABC-123/transitions' => function ($request) {
            if ($request->method() === 'GET') {
                return Http::response([
                    'transitions' => [
                        [
                            'id' => '31',
                            'name' => 'Done',
                            'to' => ['name' => 'Done'],
                        ],
                    ],
                ], 200);
            }

            if ($request->method() === 'POST') {
                return Http::response(null, 204);
            }

            return Http::response([], 404);
        },
    ]);

    $user = User::factory()->create();

    // Create Jira credentials for the user
    Credential::query()->create([
        'user_id' => $user->id,
        'source' => 'jira',
        'keys' => [
            'domain' => 'example',
            'email' => 'u@example.com',
            'token' => 'token',
        ],
    ]);

    // Create project and task with Jira meta
    $project = Project::query()->create([
        'user_id' => $user->id,
        'name' => 'owner/repo',
        'description' => 'desc',
        'paid_amount' => 0,
        'repo_id' => 'KEY',
        'source' => 'jira',
    ]);

    $task = Task::query()->create([
        'project_id' => $project->id,
        'title' => 'Test task',
        'status' => 'pending',
        'priority' => 'medium',
        'is_imported' => true,
    ]);

    TaskMeta::query()->create([
        'task_id' => $task->id,
        'source' => 'jira',
        'source_id' => 'ABC-123',
        'source_number' => '10001',
        'source_url' => 'https://example.atlassian.net/browse/ABC-123',
        'source_state' => 'To Do',
    ]);

    // reload with relation
    $task = Task::query()->with('meta', 'project')->findOrFail($task->id);

    $adapter = app(JiraAdapter::class);

    $result = $adapter->markIssueDone($task);

    expect($result)->toBeTrue();
    expect($task->fresh()->meta->source_state)->toBe('Done');
});
