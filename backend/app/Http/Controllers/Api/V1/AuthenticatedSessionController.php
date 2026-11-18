<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\LoginRequest;
use App\Http\Resources\CurrentUserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request): JsonResponse
    {
        $credentials = $request->safe()->only(['email', 'password']);
        $credentials['email'] = strtolower(trim((string) $credentials['email']));

        Auth::guard('web')->logout();
        $request->session()->forget(['pending_mfa_user_id', 'pending_mfa_remember', 'mfa_verified_at', 'mfa_verified_user_id']);

        if (! Auth::validate($credentials)) {
            return response()->json([
                'message' => 'The provided credentials do not match our records.',
                'errors' => [
                    'email' => ['The provided credentials do not match our records.'],
                ],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::query()->where('email', $credentials['email'])->first();

        if ($user === null || ! $user->is_active) {
            return response()->json([
                'message' => 'This account is inactive.',
                'code' => 'ACCOUNT_INACTIVE',
            ], Response::HTTP_FORBIDDEN);
        }

        if ($user->mfa_enabled) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            $request->session()->put([
                'pending_mfa_user_id' => $user->getAuthIdentifier(),
                'pending_mfa_remember' => $request->boolean('remember'),
            ]);

            return (new CurrentUserResource($user->load('roles.permissions')))
                ->response()
                ->setStatusCode(Response::HTTP_OK);
        }

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        return (new CurrentUserResource($request->user()->load('roles.permissions')))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
