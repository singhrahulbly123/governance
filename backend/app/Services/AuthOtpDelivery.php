<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class AuthOtpDelivery
{
    public function ensureConfigured(): void
    {
        if (app()->environment('production') && in_array(config('mail.default'), ['log', 'array'], true)) {
            abort(503, 'Email delivery is not configured.');
        }
    }

    /** @throws TransportExceptionInterface */
    public function send(string $email, string $code, string $purpose): void
    {
        $this->ensureConfigured();
        $label = $purpose === 'mfa' ? 'sign-in verification' : 'password reset';

        Mail::raw("Your {$label} code is {$code}. It expires in five minutes. If you did not request this, ignore this email.", function ($message) use ($email, $label): void {
            $message->to($email)->subject(ucfirst($label).' code');
        });
    }
}
