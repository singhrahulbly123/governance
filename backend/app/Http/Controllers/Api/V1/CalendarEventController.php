<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreCalendarEventRequest;
use App\Http\Requests\Api\V1\UpdateCalendarEventRequest;
use App\Http\Resources\CalendarEventResource;
use App\Models\CalendarEvent;
use App\Models\User;
use App\Services\WorkspaceActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CalendarEventController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $validated = $request->validate([
            'from' => ['sometimes', 'date'],
            'to' => ['sometimes', 'date'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);
        $user = $this->authenticatedUser($request);

        $events = CalendarEvent::query()
            ->where('user_id', $user->id)
            ->when(isset($validated['from']), fn ($query) => $query->where('starts_at', '>=', $validated['from']))
            ->when(isset($validated['to']), fn ($query) => $query->where('starts_at', '<=', $validated['to']))
            ->orderBy('starts_at')
            ->paginate($validated['per_page'] ?? 100);

        return CalendarEventResource::collection($events);
    }

    public function store(StoreCalendarEventRequest $request, WorkspaceActivityLogger $activityLogger): JsonResponse
    {
        $user = $this->authenticatedUser($request);
        $validated = $request->validated();

        $event = DB::transaction(function () use ($activityLogger, $user, $validated): CalendarEvent {
            $event = CalendarEvent::query()->create([
                ...$validated,
                'user_id' => $user->id,
            ]);
            $activityLogger->record(
                $user,
                'calendar_event.created',
                "Created calendar event: {$event->title}",
                'calendar_event',
                $event->id,
            );

            return $event;
        });

        return (new CalendarEventResource($event))->response()->setStatusCode(201);
    }

    public function update(
        UpdateCalendarEventRequest $request,
        int $calendarEventId,
        WorkspaceActivityLogger $activityLogger,
    ): CalendarEventResource {
        $user = $this->authenticatedUser($request);
        $event = CalendarEvent::query()
            ->where('user_id', $user->id)
            ->findOrFail($calendarEventId);
        $validated = $request->validated();
        $startsAt = $validated['starts_at'] ?? $event->starts_at;
        $endsAt = array_key_exists('ends_at', $validated) ? $validated['ends_at'] : $event->ends_at;
        if ($endsAt !== null && Carbon::parse($endsAt)->lt(Carbon::parse($startsAt))) {
            throw ValidationException::withMessages([
                'ends_at' => 'The end time must be after or equal to the start time.',
            ]);
        }

        DB::transaction(function () use ($activityLogger, $event, $user, $validated): void {
            $event->fill($validated);
            $event->save();
            $activityLogger->record(
                $user,
                'calendar_event.updated',
                "Updated calendar event: {$event->title}",
                'calendar_event',
                $event->id,
            );
        });

        return new CalendarEventResource($event->refresh());
    }

    public function destroy(Request $request, int $calendarEventId, WorkspaceActivityLogger $activityLogger): JsonResponse
    {
        $user = $this->authenticatedUser($request);
        $event = CalendarEvent::query()
            ->where('user_id', $user->id)
            ->findOrFail($calendarEventId);

        DB::transaction(function () use ($activityLogger, $event, $user): void {
            $activityLogger->record(
                $user,
                'calendar_event.deleted',
                "Deleted calendar event: {$event->title}",
                'calendar_event',
                $event->id,
            );
            $event->delete();
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
