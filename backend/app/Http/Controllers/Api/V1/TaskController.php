<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreTaskRequest;
use App\Http\Requests\Api\V1\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\User;
use App\Services\WorkspaceActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'nullable', 'in:pending,in_progress,completed,cancelled'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);
        $user = $this->authenticatedUser($request);

        $tasks = Task::query()
            ->where('user_id', $user->id)
            ->when(isset($validated['status']) && $validated['status'] !== '', fn ($query) => $query->where('status', $validated['status']))
            ->orderByRaw('due_at is null')
            ->orderBy('due_at')
            ->orderByDesc('created_at')
            ->paginate($validated['per_page'] ?? 100);

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request, WorkspaceActivityLogger $activityLogger): JsonResponse
    {
        $user = $this->authenticatedUser($request);
        $validated = $request->validated();

        $task = DB::transaction(function () use ($activityLogger, $user, $validated): Task {
            $task = Task::query()->create([
                ...$validated,
                'user_id' => $user->id,
                'completed_at' => $validated['status'] === 'completed' ? now() : null,
            ]);
            $activityLogger->record(
                $user,
                'task.created',
                "Created task: {$task->title}",
                'task',
                $task->id,
                ['status' => $task->status, 'priority' => $task->priority],
            );

            return $task;
        });

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function update(
        UpdateTaskRequest $request,
        int $taskId,
        WorkspaceActivityLogger $activityLogger,
    ): TaskResource {
        $user = $this->authenticatedUser($request);
        $task = Task::query()
            ->where('user_id', $user->id)
            ->findOrFail($taskId);
        $validated = $request->validated();

        DB::transaction(function () use ($activityLogger, $task, $user, $validated): void {
            $task->fill($validated);
            if (array_key_exists('status', $validated)) {
                $task->completed_at = $validated['status'] === 'completed'
                    ? ($task->completed_at ?? now())
                    : null;
            }
            $task->save();
            $activityLogger->record(
                $user,
                'task.updated',
                "Updated task: {$task->title}",
                'task',
                $task->id,
                ['status' => $task->status, 'priority' => $task->priority],
            );
        });

        return new TaskResource($task->refresh());
    }

    public function destroy(Request $request, int $taskId, WorkspaceActivityLogger $activityLogger): JsonResponse
    {
        $user = $this->authenticatedUser($request);
        $task = Task::query()
            ->where('user_id', $user->id)
            ->findOrFail($taskId);

        DB::transaction(function () use ($activityLogger, $task, $user): void {
            $activityLogger->record(
                $user,
                'task.deleted',
                "Deleted task: {$task->title}",
                'task',
                $task->id,
            );
            $task->delete();
        });

        return response()->json(status: 204);
    }

    private function authenticatedUser(Request $request): User
    {
        $user = $request->user();
        abort_unless($user instanceof User, 401);

        return $user;
    }
}
