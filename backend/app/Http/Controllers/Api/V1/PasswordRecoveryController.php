<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\ResetPasswordRequest;
use App\Http\Requests\Api\V1\VerifyOtpRequest;
use App\Models\AuthOtpCode;
use App\Models\User;
use App\Services\AuthOtpDelivery;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class PasswordRecoveryController extends Controller
{
    public function sendCode(ForgotPasswordRequest $request, AuthOtpDelivery $delivery): JsonResponse
    {
        $email = strtolower(trim((string) $request->validated('email')));
        $delivery->ensureConfigured();
        $user = User::query()->where('email', $email)->where('is_active', true)->first();

        if ($user !== null) {
            $code = (string) random_int(100000, 999999);
            AuthOtpCode::query()->where('email', $email)->where('purpose', 'password_reset')->delete();
            $otp = AuthOtpCode::query()->create([
                'email' => $email,
                'purpose' => 'password_reset',
                'code' => Hash::make($code),
                'attempts' => 0,
                'expires_at' => now()->addMinutes(5),
            ]);

            try {
                $delivery->send($email, $code, 'password_reset');
            } catch (Throwable $exception) {
                $otp->delete();
                report($exception);

                return response()->json(['message' => 'Email delivery is temporarily unavailable.'], Response::HTTP_SERVICE_UNAVAILABLE);
            }
        }

        return response()->json([
            'data' => [
                'sent' => true,
                'email' => $email,
                'expires_in_seconds' => 300,
                'demo_code' => app()->environment(['local', 'testing']) && $user !== null ? $code : null,
            ],
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $email = strtolower(trim((string) $request->validated('email')));
        $code = (string) $request->validated('code');
        $result = DB::transaction(function () use ($email, $code): string {
            $otp = AuthOtpCode::query()
                ->where('email', $email)
                ->where('purpose', 'password_reset')
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

            $otp->update(['verified_at' => now()]);

            return 'verified';
        });

        if ($result !== 'verified') {
            $message = $result === 'expired' ? 'That code has expired. Request a new one.' : 'That code is not valid.';

            return response()->json([
                'message' => $message,
                'errors' => ['code' => [$message]],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['data' => ['verified' => true]]);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $email = strtolower(trim((string) $validated['email']));
        $password = (string) $validated['password'];

        if (! $this->meetsComplexity($password)) {
            return response()->json([
                'message' => 'Your password does not meet the requirements yet.',
                'errors' => ['password' => ['Your password does not meet the requirements yet.']],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $reset = DB::transaction(function () use ($email, $password, $validated): bool {
            $otp = AuthOtpCode::query()
                ->where('email', $email)
                ->where('purpose', 'password_reset')
                ->latest('id')
                ->lockForUpdate()
                ->first();

            if ($otp === null || $otp->verified_at === null || $otp->expires_at->isPast()
                || $otp->attempts >= 5 || ! Hash::check((string) $validated['code'], $otp->code)) {
                return false;
            }

            $user = User::query()->where('email', $email)->where('is_active', true)->lockForUpdate()->first();

            if ($user === null || Hash::check($password, $user->password)) {
                return false;
            }

            $user->update(['password' => Hash::make($password)]);
            $otp->delete();

            return true;
        });

        if (! $reset) {
            return response()->json([
                'message' => 'A valid, verified reset code is required.',
                'errors' => ['code' => ['A valid, verified reset code is required.']],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['data' => ['reset' => true]]);
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
