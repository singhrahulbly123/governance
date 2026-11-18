<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateProfileRequest;
use App\Http\Resources\CurrentUserResource;
use Illuminate\Http\JsonResponse;

class ProfileSetupController extends Controller
{
    public function __invoke(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $updates = [
            'onboarded_at' => $user->onboarded_at ?? now(),
        ];

        if (array_key_exists('name', $validated)) {
            $updates['name'] = trim((string) $validated['name']);
        }

        if (array_key_exists('phone', $validated)) {
            $updates['phone'] = $validated['phone'] !== null ? trim((string) $validated['phone']) : null;
        }

        if (array_key_exists('department', $validated) && $validated['department'] !== null) {
            $updates['department'] = trim((string) $validated['department']);
        }

        if (array_key_exists('avatar_url', $validated)) {
            $updates['avatar_url'] = $validated['avatar_url'];
        }

        if (array_key_exists('mfa_enabled', $validated)) {
            $updates['mfa_enabled'] = (bool) $validated['mfa_enabled'];
        }

        $user->update($updates);

        return (new CurrentUserResource($user->fresh()->load('roles.permissions')))
            ->response();
    }
}
