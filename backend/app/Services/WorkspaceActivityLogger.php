<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;

class WorkspaceActivityLogger
{
    /**
     * @param  array<string, bool|int|string|null>  $metadata
     */
    public function record(
        User $user,
        string $event,
        string $description,
        ?string $subjectType = null,
        ?int $subjectId = null,
        array $metadata = [],
    ): ActivityLog {
        return ActivityLog::query()->create([
            'user_id' => $user->id,
            'event' => $event,
            'description' => $description,
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'metadata' => $metadata === [] ? null : $metadata,
        ]);
    }
}
