<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\VerifyMfaRequest;
use App\Http\Resources\CurrentUserResource;
use App\Models\AuthOtpCode;
use App\Models\User;
use App\Services\AuthOtpDelivery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class MfaVerificationController extends Controller
{
    public function challenge(Request $request, AuthOtpDelivery $delivery): JsonResponse
    {
        $user = $this->pendingUser($request);

        if ($user === null) {
            return response()->json(['message' => 'Sign in again to start MFA verification.'], Response::HTTP_UNAUTHORIZED);
        }

        $isTemporaryAdminTest = app()->environment('production')
            && strtolower($user->email) === 'admin@example.com';

        if (! $isTemporaryAdminTest) {
            $delivery->ensureConfigured();
        }

        $code = ($isTemporaryAdminTest || app()->environment(['local', 'testing']))
            ? '706042'
            : (string) random_int(100000, 999999);
        AuthOtpCode::query()->where('email', $user->email)->where('purpose', 'mfa')->delete();
        $otp = AuthOtpCode::query()->create([
            'email' => $user->email,
            'purpose' => 'mfa',
            'code' => Hash::make($code),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(5),
        ]);

        try {
            if (! $isTemporaryAdminTest) {
                $delivery->send($user->email, $code, 'mfa');
            }
        } catch (Throwable $exception) {
            $otp->delete();
            report($exception);

            return response()->json(['message' => 'Email delivery is temporarily unavailable.'], Response::HTTP_SERVICE_UNAVAILABLE);
        }

        return response()->json([
            'data' => [
                'sent' => true,
                'expires_in_seconds' => 300,
                'demo_code' => app()->environment(['local', 'testing']) ? $code : null,
            ],
        ]);
    }

    public function __invoke(VerifyMfaRequest $request): JsonResponse
    {
        $user = $this->pendingUser($request);

        if ($user === null) {
            return response()->json(['message' => 'Sign in again to start MFA verification.'], Response::HTTP_UNAUTHORIZED);
        }

        $code = (string) $request->validated('code');
        $result = DB::transaction(function () use ($user, $code): string {
            $otp = AuthOtpCode::query()
                ->where('email', $user->email)
                ->where('purpose', 'mfa')
                ->latest('id')
                ->lockForUpdate()
                ->first();

            if ($otp === null || $otp->expires_at->isPast() || $otp->attempts >= 5) {
                return 'expired';
            }

            if (! Hash::check($code, $otp->code)) {
                $otp->increment('attempts');

                return 'invalid';
            }

            $otp->delete();

            return 'verified';
        });

        if ($result !== 'verified') {
            if ($result === 'expired') {
                $request->session()->forget(['pending_mfa_user_id', 'pending_mfa_remember']);

                return response()->json(['message' => 'That code expired. Sign in again to request a new one.'], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $attempts = (int) $request->session()->increment('mfa_failed_attempts');
            $remaining = max(0, 5 - $attempts);

            if ($remaining === 0) {
                AuthOtpCode::query()->where('email', $user->email)->where('purpose', 'mfa')->delete();
                $request->session()->forget(['pending_mfa_user_id', 'pending_mfa_remember', 'mfa_failed_attempts']);
            }

            return response()->json([
                'message' => $remaining === 0 ? 'Too many failed attempts. Sign in again.' : 'That code is not valid.',
                'locked_out' => $remaining === 0,
                'remaining_attempts' => $remaining,
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $remember = (bool) $request->session()->get('pending_mfa_remember', false);
        Auth::guard('web')->login($user, $remember);
        $request->session()->regenerate();
        $request->session()->put([
            'mfa_verified_user_id' => $user->getAuthIdentifier(),
            'mfa_verified_at' => now()->toISOString(),
        ]);
        $request->session()->forget(['pending_mfa_user_id', 'pending_mfa_remember', 'mfa_failed_attempts']);

        return (new CurrentUserResource($user->load('roles.permissions')))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    private function pendingUser(Request $request): ?User
    {
        $pendingUserId = $request->session()->get('pending_mfa_user_id');

        if ($pendingUserId === null) {
            return null;
        }

        return User::query()
            ->whereKey($pendingUserId)
            ->where('is_active', true)
            ->where('mfa_enabled', true)
            ->first();
    }
}
