<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SessionHeartbeatController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->hasSession()) {
            $request->session()->put('last_extended_at', now()->toISOString());
        }

        return response()->json([
            'data' => [
                'extended' => true,
                'expires_in_minutes' => (int) config('session.lifetime', 120),
            ],
        ]);
    }
}
