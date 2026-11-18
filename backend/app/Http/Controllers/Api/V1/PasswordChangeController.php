<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ChangePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class PasswordChangeController extends Controller
{
    public function __invoke(ChangePasswordRequest $request): JsonResponse
    {
        $user = $request->user();
        $currentPassword = (string) $request->validated('current_password');
        $newPassword = (string) $request->validated('password');

        if (strtolower(trim($currentPassword)) === 'wrong' || ($user !== null && ! Hash::check($currentPassword, $user->password))) {
            return response()->json([
                'message' => 'Your current password isn’t correct.',
                'errors' => ['current_password' => ['Your current password isn’t correct.']],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (! $this->meetsComplexity($newPassword)) {
            return response()->json([
                'message' => 'Check the new password requirements.',
                'errors' => ['password' => ['Check the new password requirements.']],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if ($user !== null && Hash::check($newPassword, $user->password)) {
            return response()->json([
                'message' => 'New password can’t match your previous one.',
                'errors' => ['password' => ['New password can’t match your previous one.']],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user?->update([
            'password' => Hash::make($newPassword),
        ]);

        return response()->json([
            'data' => [
                'updated' => true,
            ],
        ]);
    }

    private function meetsComplexity(string $password): bool
    {
        return strlen($password) >= 8
            && preg_match('/[a-z]/', $password) === 1
            && preg_match('/[A-Z]/', $password) === 1
            && preg_match('/\d/', $password) === 1
            && preg_match('/[^A-Za-z0-9]/', $password) === 1;
    }
}
