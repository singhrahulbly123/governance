<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureMfaVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user !== null && $user->mfa_enabled) {
            $verifiedAt = $request->session()->get('mfa_verified_at');
            $verifiedUserId = $request->session()->get('mfa_verified_user_id');
            $verificationTime = is_string($verifiedAt) ? Carbon::parse($verifiedAt) : null;
            $isVerified = (string) $verifiedUserId === (string) $user->getAuthIdentifier()
                && $verificationTime !== null
                && $verificationTime->isPast()
                && $verificationTime->diffInSeconds(now()) <= config('session.lifetime') * 60;

            if (! $isVerified) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return response()->json([
                    'message' => 'MFA verification is required.',
                    'code' => 'MFA_REQUIRED',
                ], Response::HTTP_FORBIDDEN);
            }
        }

        return $next($request);
    }
}
