<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\DashboardState;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Return persisted dashboard state overrides and action log.
     */
    public function show(Request $request): JsonResponse
    {
        $state = DashboardState::query()
            ->where('user_id', $request->user()->getAuthIdentifier())
            ->first();

        return response()->json([
            'data' => [
                'overrides' => $state === null ? null : [
                    'dash' => $state->dash,
                    'util' => $state->util,
                ],
                'last_action' => $state?->last_action,
                'updated_at' => $state?->updated_at?->toIso8601String() ?? now()->toIso8601String(),
            ],
        ]);
    }

    /**
     * Persist updated dashboard state from any of the 8 role dashboards or utility screens.
     */
    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'dash' => ['required', 'array'],
            'util' => ['required', 'array'],
            'last_action' => ['nullable', 'string', 'max:500'],
        ]);

        $payload = [
            'overrides' => [
                'dash' => $validated['dash'],
                'util' => $validated['util'],
            ],
            'last_action' => $validated['last_action'] ?? null,
            'updated_at' => now()->toIso8601String(),
        ];

        DashboardState::query()->updateOrCreate(
            ['user_id' => $request->user()->getAuthIdentifier()],
            [
                'dash' => $validated['dash'],
                'util' => $validated['util'],
                'last_action' => $validated['last_action'] ?? null,
            ],
        );

        return response()->json([
            'data' => $payload,
        ]);
    }

    /**
     * Reset dashboard state back to initial seed data.
     */
    public function reset(Request $request): JsonResponse
    {
        DashboardState::query()
            ->where('user_id', $request->user()->getAuthIdentifier())
            ->delete();

        return response()->json([
            'data' => [
                'overrides' => null,
                'updated_at' => now()->toIso8601String(),
            ],
        ]);
    }
}
