"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
    AuthApiError,
    changeCurrentPassword,
    extendActiveSession,
    getCachedAuthUser,
    getCurrentUser,
    requestMfaChallenge,
    requestPasswordResetCode,
    resetPasswordWithOtp,
    signIn,
    signOut,
    updateProfileSetup,
    verifyMfaChallenge,
    verifyPasswordResetOtp,
} from "@/services/api/auth";
import type { AuthScreenId, CurrentUser } from "@/types/auth";
import {
    AuthButton,
    AuthCard,
    AuthCardWrap,
    AuthCheckbox,
    AuthFormField,
    AuthIcon,
    AuthInput,
    AuthSpinner,
    AuthSwitch,
    Avatar,
    Banner,
    Brand,
    Complexity,
    Divider,
    OTPInput,
    PasswordField,
    passwordValid,
    ReadOnlyField,
    ResendRow,
    Stepper,
    useCountdown,
} from "./auth-primitives";

export type AuthUserSummary = {
    name: string;
    email: string;
    role: string;
    dept: string;
    phone?: string;
    avatarUrl?: string | null;
    mfaEnabled?: boolean;
    onboardedAt?: string | null;
    isSuperAdmin?: boolean;
};

const DEFAULT_USER: AuthUserSummary = {
    name: "Anita Rao",
    email: "anita.rao@example.com",
    role: "Head of Department",
    dept: "Computer Science",
};

const STORAGE_EMAIL_KEY = "dia_thrive_recovery_email";
const STORAGE_DEMO_CODE_KEY = "dia_thrive_recovery_demo_code";
const STORAGE_VERIFIED_CODE_KEY = "dia_thrive_recovery_verified_code";

function readStorage(key: string): string {
    if (typeof window === "undefined") return "";
    return window.sessionStorage.getItem(key) ?? "";
}

function writeStorage(key: string, value: string): void {
    if (typeof window === "undefined") return;
    if (value) {
        window.sessionStorage.setItem(key, value);
    } else {
        window.sessionStorage.removeItem(key);
    }
}

export function toUserSummary(user: CurrentUser | null): AuthUserSummary {
    if (!user) return DEFAULT_USER;
    const isSuperAdmin = user.roles.some((r) => r.slug === "super-administrator");
    const primaryRole =
        user.roles[0]?.name ?? (isSuperAdmin ? "Super Administrator" : "Administrator");
    return {
        name: user.name || DEFAULT_USER.name,
        email: user.email || DEFAULT_USER.email,
        role: primaryRole,
        dept: user.department || "Computer Science",
        phone: user.phone ?? "",
        avatarUrl: user.avatar_url ?? null,
        mfaEnabled: !!user.mfa_enabled,
        onboardedAt: user.onboarded_at ?? null,
        isSuperAdmin,
    };
}

function getPostLoginDestination(user: CurrentUser): string {
    if (!user.onboarded_at) {
        return "/onboarding/welcome";
    }
    const isSuperAdmin = user.roles.some((role) => role.slug === "super-administrator");
    return isSuperAdmin ? "/super-admin" : "/admin";
}

// AUTH-001 — Login. SSO primary; native email+password below a divider.
export function LoginScreen({
    go,
    onAuthenticated,
}: {
    go: (id: AuthScreenId) => void;
    onAuthenticated?: (user: CurrentUser) => void;
}) {
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [remember, setRemember] = useState(false);
    const [err, setErr] = useState("");
    const [ssoLoading, setSsoLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const institutional = /@(university|dia)\.(edu|ac\.in)$/i.test(email.trim());

    const handleSso = () => {
        setSsoLoading(true);
        setTimeout(() => {
            setSsoLoading(false);
            go("mfa");
        }, 800);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
            setErr("Enter a valid email address.");
            return;
        }
        if (pw.trim().toLowerCase() === "inactive") {
            go("unauthorized");
            return;
        }
        if (pw.length < 4) {
            setErr("That email or password doesn’t match our records.");
            return;
        }

        setErr("");
        setSubmitting(true);

        try {
            const user = await signIn(email.trim(), pw, remember);
            onAuthenticated?.(user);
            if (user.mfa_enabled) {
                go("mfa");
                return;
            }
            window.location.replace(getPostLoginDestination(user));
        } catch (reason) {
            if (reason instanceof AuthApiError && reason.status === 403) {
                go("unauthorized");
                return;
            }
            setErr(
                reason instanceof Error
                    ? reason.message
                    : "That email or password doesn’t match our records."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthCardWrap>
            <Brand sub="Academic Governance Platform" />
            <AuthCard
                title="Sign in"
                desc="Institutional users continue with single sign-on. Visiting faculty and external evaluators use email and password."
            >
                <div className="flex flex-col gap-4.5">
                    <AuthButton
                        size="lg"
                        className="w-full whitespace-normal leading-snug"
                        loading={ssoLoading}
                        icon={!ssoLoading ? <AuthIcon name="Building2" size={19} /> : undefined}
                        onClick={handleSso}
                    >
                        {ssoLoading
                            ? "Redirecting to your institution…"
                            : "Continue with institutional account"}
                    </AuthButton>
                    <Divider label="or" />
                    <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                        <AuthFormField label="Email" htmlFor="lg-em">
                            <AuthInput
                                id="lg-em"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                placeholder="you@example.com"
                                icon={<AuthIcon name="Mail" size={18} />}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (err) setErr("");
                                }}
                            />
                        </AuthFormField>
                        {institutional ? (
                            <Banner tone="info">
                                This is an institutional email — continue with single sign-on above.
                            </Banner>
                        ) : (
                            <AuthFormField
                                label="Password"
                                htmlFor="lg-pw"
                                error={err || undefined}
                            >
                                <PasswordField
                                    id="lg-pw"
                                    value={pw}
                                    invalid={!!err}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    onChange={(e) => {
                                        setPw(e.target.value);
                                        if (err) setErr("");
                                    }}
                                />
                            </AuthFormField>
                        )}
                        <div className="flex items-center justify-between">
                            <AuthCheckbox
                                label="Stay signed in"
                                checked={remember}
                                onChange={setRemember}
                            />
                            <AuthButton
                                variant="ghost"
                                size="sm"
                                type="button"
                                onClick={() => go("forgot")}
                            >
                                Forgot password?
                            </AuthButton>
                        </div>
                        <AuthButton
                            type="submit"
                            variant="secondary"
                            size="lg"
                            className="w-full"
                            loading={submitting}
                            disabled={institutional}
                        >
                            {submitting ? "Signing in…" : "Sign in"}
                        </AuthButton>
                    </form>
                </div>
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-002 — Forgot Password.
export function ForgotScreen({
    go,
    recoveryEmail,
    onRecoveryEmailChange,
}: {
    go: (id: AuthScreenId) => void;
    recoveryEmail?: string;
    onRecoveryEmailChange?: (email: string, demoCode?: string | null) => void;
}) {
    const [emailOverride, setEmailOverride] = useState<string | null>(null);
    const [sent, setSent] = useState(false);
    const [demoCode, setDemoCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const email = emailOverride ?? recoveryEmail ?? readStorage(STORAGE_EMAIL_KEY);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
            setErr("Enter a valid email address.");
            return;
        }
        setErr("");
        setLoading(true);
        try {
            const result = await requestPasswordResetCode(trimmed);
            const code = result.demo_code ?? null;
            setDemoCode(code);
            writeStorage(STORAGE_EMAIL_KEY, trimmed);
            writeStorage(STORAGE_DEMO_CODE_KEY, code ?? "");
            onRecoveryEmailChange?.(trimmed, code);
            setSent(true);
        } catch (reason) {
            setErr(reason instanceof Error ? reason.message : "Enter a valid email address.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCardWrap>
            <Brand />
            <AuthCard
                icon="KeyRound"
                title="Forgot your password?"
                desc="Enter the email tied to your account and we’ll send a 6-digit code to reset it."
                footer={
                    <AuthButton
                        variant="ghost"
                        size="sm"
                        icon={<AuthIcon name="ArrowLeft" size={16} />}
                        onClick={() => go("login")}
                    >
                        Back to sign in
                    </AuthButton>
                }
            >
                {sent ? (
                    <div className="flex flex-col gap-4.5">
                        <Banner tone="green" title="Check your email">
                            If an account exists for <strong>{email}</strong>, a 6-digit code is on
                            its way. It expires in 5 minutes.
                            {demoCode && (
                                <span className="mt-1.5 block rounded-md bg-white/80 px-2.5 py-1.5 text-xs text-slate-700">
                                    Verification code:{" "}
                                    <strong className="font-bold text-indigo-700 tabular-nums">
                                        {demoCode}
                                    </strong>
                                </span>
                            )}
                        </Banner>
                        <AuthButton size="lg" className="w-full" onClick={() => go("otp")}>
                            Enter code
                        </AuthButton>
                    </div>
                ) : (
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <AuthFormField label="Email" htmlFor="fg-em" error={err || undefined}>
                            <AuthInput
                                id="fg-em"
                                type="email"
                                value={email}
                                invalid={!!err}
                                placeholder="you@example.com"
                                icon={<AuthIcon name="Mail" size={18} />}
                                onChange={(e) => {
                                    setEmailOverride(e.target.value);
                                    if (err) setErr("");
                                }}
                            />
                        </AuthFormField>
                        <AuthButton type="submit" size="lg" className="w-full" loading={loading}>
                            {loading ? "Sending code…" : "Send code"}
                        </AuthButton>
                    </form>
                )}
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-003 — OTP Verification (recovery context).
export function OTPScreen({
    go,
    recoveryEmail = "",
    demoOtpCode,
    onVerifiedCode,
    onNewDemoCode,
}: {
    go: (id: AuthScreenId) => void;
    recoveryEmail?: string;
    demoOtpCode?: string | null;
    onVerifiedCode?: (code: string) => void;
    onNewDemoCode?: (code: string | null) => void;
}) {
    const [code, setCode] = useState("");
    const [err, setErr] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [localDemoCode, setLocalDemoCode] = useState<string | null>(
        demoOtpCode ?? (readStorage(STORAGE_DEMO_CODE_KEY) || null)
    );

    const activeEmail = recoveryEmail || readStorage(STORAGE_EMAIL_KEY);
    const activeDemoCode = demoOtpCode ?? localDemoCode;

    const complete = async (val: string) => {
        setVerifying(true);
        try {
            await verifyPasswordResetOtp(activeEmail, val);
            writeStorage(STORAGE_VERIFIED_CODE_KEY, val);
            onVerifiedCode?.(val);
            go("reset");
        } catch (reason) {
            setErr(
                reason instanceof Error
                    ? reason.message
                    : "That code isn’t right. Check your email and try again."
            );
            setCode("");
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!activeEmail) return;
        try {
            const res = await requestPasswordResetCode(activeEmail);
            const nextCode = res.demo_code ?? null;
            setLocalDemoCode(nextCode);
            writeStorage(STORAGE_DEMO_CODE_KEY, nextCode ?? "");
            onNewDemoCode?.(nextCode);
            setErr("");
        } catch {
            // ignore
        }
    };

    return (
        <AuthCardWrap>
            <Brand />
            <AuthCard
                icon="MailCheck"
                title="Verify your email"
                desc={
                    <>
                        We sent a 6-digit code to{" "}
                        <strong>{activeEmail || "your email"}</strong>. Enter it below to continue
                        resetting your password.
                    </>
                }
                footer={
                    <AuthButton
                        variant="ghost"
                        size="sm"
                        icon={<AuthIcon name="ArrowLeft" size={16} />}
                        onClick={() => go("forgot")}
                    >
                        Use a different email
                    </AuthButton>
                }
            >
                <div className="flex flex-col gap-4.5">
                    {activeDemoCode && (
                        <Banner tone="info" title="Verification code">
                            <div className="flex items-center justify-between gap-2">
                                <span>
                                    Code:{" "}
                                    <strong className="font-bold text-indigo-700 tabular-nums">
                                        {activeDemoCode}
                                    </strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCode(activeDemoCode);
                                        setErr("");
                                        complete(activeDemoCode);
                                    }}
                                    className="cursor-pointer rounded-md bg-indigo-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-800"
                                >
                                    Auto-fill &amp; Verify
                                </button>
                            </div>
                        </Banner>
                    )}
                    <OTPInput
                        value={code}
                        onChange={(v) => {
                            setCode(v);
                            if (err) setErr("");
                        }}
                        onComplete={complete}
                        invalid={!!err}
                        autoFocus
                    />
                    {err && <Banner tone="red">{err}</Banner>}
                    {verifying && (
                        <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                            <AuthSpinner size={16} /> Verifying…
                        </div>
                    )}
                    <ResendRow unlockAfter={5} onResend={handleResend} />
                </div>
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-004 — Reset Password.
export function ResetScreen({
    go,
    recoveryEmail = "",
    verifiedCode = "",
}: {
    go: (id: AuthScreenId) => void;
    recoveryEmail?: string;
    verifiedCode?: string;
}) {
    const [emailOverride, setEmailOverride] = useState<string | null>(null);
    const [pw, setPw] = useState("");
    const [confirm, setConfirm] = useState("");
    const [err, setErr] = useState("");
    const [done, setDone] = useState(false);
    const [saving, setSaving] = useState(false);

    const valid = passwordValid(pw);
    const match = pw.length > 0 && pw === confirm;
    const storedEmail = recoveryEmail || readStorage(STORAGE_EMAIL_KEY);
    const targetEmail = emailOverride ?? storedEmail;
    const targetCode = verifiedCode || readStorage(STORAGE_VERIFIED_CODE_KEY);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetEmail.trim()) {
            setErr("Enter the account email address to reset.");
            return;
        }
        if (!valid) {
            setErr("Your password doesn’t meet the requirements yet.");
            return;
        }
        if (!match) {
            setErr("Both passwords must match.");
            return;
        }
        if (pw.toLowerCase() === "password1!") {
            setErr("New password can’t match your previous one.");
            return;
        }

        setSaving(true);
        try {
            await resetPasswordWithOtp({
                email: targetEmail.trim(),
                code: targetCode || undefined,
                password: pw,
                passwordConfirmation: confirm,
            });
            writeStorage(STORAGE_DEMO_CODE_KEY, "");
            writeStorage(STORAGE_VERIFIED_CODE_KEY, "");
            setDone(true);
        } catch (reason) {
            setErr(
                reason instanceof Error
                    ? reason.message
                    : "New password can’t match your previous one."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthCardWrap>
            <Brand />
            <AuthCard
                icon="ShieldCheck"
                title="Set a new password"
                desc="Choose a strong password you haven’t used on this account before."
            >
                {done ? (
                    <div className="flex flex-col gap-4">
                        <Banner tone="green" title="Password updated">
                            You can now sign in with your new password.
                        </Banner>
                        <AuthButton
                            size="lg"
                            className="w-full"
                            onClick={() => go("login")}
                        >
                            Back to sign in
                        </AuthButton>
                    </div>
                ) : (
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        {!storedEmail && (
                            <AuthFormField label="Account email" htmlFor="rs-em" required>
                                <AuthInput
                                    id="rs-em"
                                    type="email"
                                    value={targetEmail}
                                    placeholder="you@example.com"
                                    icon={<AuthIcon name="Mail" size={18} />}
                                    onChange={(e) => {
                                        setEmailOverride(e.target.value);
                                        if (err) setErr("");
                                    }}
                                />
                            </AuthFormField>
                        )}
                        <AuthFormField label="New password" htmlFor="rs-pw" required>
                            <PasswordField
                                id="rs-pw"
                                value={pw}
                                autoComplete="new-password"
                                placeholder="Enter a new password"
                                onChange={(e) => {
                                    setPw(e.target.value);
                                    if (err) setErr("");
                                }}
                            />
                        </AuthFormField>
                        <Complexity value={pw} />
                        <AuthFormField
                            label="Confirm password"
                            htmlFor="rs-cf"
                            required
                            error={
                                confirm.length > 0 && !match ? "Passwords don’t match." : undefined
                            }
                        >
                            <PasswordField
                                id="rs-cf"
                                value={confirm}
                                invalid={confirm.length > 0 && !match}
                                autoComplete="new-password"
                                placeholder="Re-enter the password"
                                onChange={(e) => {
                                    setConfirm(e.target.value);
                                    if (err) setErr("");
                                }}
                            />
                        </AuthFormField>
                        {err && <Banner tone="red">{err}</Banner>}
                        <AuthButton
                            type="submit"
                            size="lg"
                            className="w-full"
                            loading={saving}
                            disabled={!valid || !match || !targetEmail.trim()}
                        >
                            Save new password
                        </AuthButton>
                    </form>
                )}
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-005 — Change Password (authenticated account setting).
export function ChangeScreen({
    go,
    inDashboard = false,
}: {
    go: (id: AuthScreenId) => void;
    inDashboard?: boolean;
}) {
    const [cur, setCur] = useState("");
    const [pw, setPw] = useState("");
    const [confirm, setConfirm] = useState("");
    const [err, setErr] = useState("");
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);

    const valid = passwordValid(pw);
    const match = pw.length > 0 && pw === confirm;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cur.trim().toLowerCase() === "wrong" || cur.length < 4) {
            setErr("Your current password isn’t correct.");
            return;
        }
        if (!valid || !match) {
            setErr("Check the new password requirements.");
            return;
        }

        setSaving(true);
        try {
            await changeCurrentPassword({
                currentPassword: cur,
                password: pw,
                passwordConfirmation: confirm,
            });
            setErr("");
            setDone(true);
        } catch (reason) {
            setErr(
                reason instanceof Error
                    ? reason.message
                    : "Your current password isn’t correct."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthCardWrap>
            {!inDashboard && <Brand />}
            <AuthCard
                icon="Lock"
                title="Change password"
                desc="Confirm your current password, then set a new one. We ask for the current password even though you’re signed in."
            >
                {done ? (
                    <div className="flex flex-col gap-4.5">
                        <Banner tone="green" title="Password updated">
                            Your new password is active. Use it next time you sign in.
                        </Banner>
                        <AuthButton
                            variant="secondary"
                            size="lg"
                            className="w-full"
                            onClick={() => {
                                setCur("");
                                setPw("");
                                setConfirm("");
                                setDone(false);
                                if (!inDashboard) go("dashboard");
                            }}
                        >
                            {inDashboard ? "Done" : "Back to dashboard"}
                        </AuthButton>
                    </div>
                ) : (
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <AuthFormField
                            label="Current password"
                            htmlFor="ch-cur"
                            required
                            error={err || undefined}
                        >
                            <PasswordField
                                id="ch-cur"
                                value={cur}
                                autoComplete="current-password"
                                placeholder="Enter current password"
                                invalid={!!err}
                                onChange={(e) => {
                                    setCur(e.target.value);
                                    if (err) setErr("");
                                }}
                            />
                        </AuthFormField>
                        <div className="h-px bg-slate-100" />
                        <AuthFormField label="New password" htmlFor="ch-pw" required>
                            <PasswordField
                                id="ch-pw"
                                value={pw}
                                autoComplete="new-password"
                                placeholder="Enter a new password"
                                onChange={(e) => {
                                    setPw(e.target.value);
                                    if (err) setErr("");
                                }}
                            />
                        </AuthFormField>
                        <Complexity value={pw} />
                        <AuthFormField
                            label="Confirm new password"
                            htmlFor="ch-cf"
                            required
                            error={
                                confirm.length > 0 && !match ? "Passwords don’t match." : undefined
                            }
                        >
                            <PasswordField
                                id="ch-cf"
                                value={confirm}
                                invalid={confirm.length > 0 && !match}
                                autoComplete="new-password"
                                placeholder="Re-enter the new password"
                                onChange={(e) => {
                                    setConfirm(e.target.value);
                                    if (err) setErr("");
                                }}
                            />
                        </AuthFormField>
                        <AuthButton
                            type="submit"
                            size="lg"
                            className="w-full"
                            loading={saving}
                            disabled={cur.length < 4 || !valid || !match}
                        >
                            Save
                        </AuthButton>
                    </form>
                )}
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-006 — First Time Login (Onboarding Step 1 of 2).
export function FirstTimeScreen({
    go,
    user = DEFAULT_USER,
}: {
    go: (id: AuthScreenId) => void;
    user?: AuthUserSummary;
}) {
    const firstName = user.name.split(" ")[0] || "Administrator";

    return (
        <AuthCardWrap>
            <Brand />
            <AuthCard width={480}>
                <Stepper current={1} labels={["Welcome", "Your profile"]} />
                <div className="text-[22px] font-bold tracking-tight text-slate-800">
                    Welcome, {firstName}.
                </div>
                <div className="mt-1.5 text-[14px] leading-[1.55] text-slate-500">
                    You’re signed in as{" "}
                    <strong className="font-semibold text-slate-700">{user.role}</strong> ·{" "}
                    {user.dept}.
                </div>
                <div className="my-5 rounded-lg border border-slate-200 bg-slate-50 p-4.5">
                    <div className="text-[14px] leading-relaxed text-slate-700">
                        <strong className="font-semibold text-slate-800">ERP</strong> is your
                        academic governance platform — a single place to log delivery, track audits,
                        and act on cohort insights. Let’s take a moment to confirm your details.
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                        {(
                            [
                                ["ClipboardCheck", "Review and respond to academic audits"],
                                ["Sparkles", "Get AI-surfaced insights on your cohorts"],
                                ["Smartphone", "Log class delivery from any device"],
                            ] as const
                        ).map(([ic, tx]) => (
                            <div
                                key={tx}
                                className="flex items-center gap-3 text-[13.5px] text-slate-600"
                            >
                                <span className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                                    <AuthIcon name={ic} size={17} />
                                </span>
                                {tx}
                            </div>
                        ))}
                    </div>
                </div>
                <AuthButton
                    size="lg"
                    className="w-full"
                    iconRight={<AuthIcon name="ArrowRight" size={18} />}
                    onClick={() => go("profile")}
                >
                    Continue
                </AuthButton>
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-007 — Multi-Factor Authentication (MFA).
export function MfaScreen({
    go,
    user = DEFAULT_USER,
}: {
    go: (id: AuthScreenId) => void;
    user?: AuthUserSummary;
}) {
    const [code, setCode] = useState("");
    const [demoMfaCode, setDemoMfaCode] = useState<string | null>(null);
    const [err, setErr] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [remember, setRemember] = useState(false);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        requestMfaChallenge(user.email)
            .then((res) => setDemoMfaCode(res.demo_code ?? null))
            .catch((reason: unknown) => {
                if (reason instanceof AuthApiError && reason.status === 401) {
                    window.location.replace("/login");
                    return;
                }

                setErr(reason instanceof Error ? reason.message : "Could not start MFA verification.");
            });
    }, [user.email]);

    const complete = async (val: string) => {
        setVerifying(true);
        try {
            await verifyMfaChallenge(val, remember);
            if (!user.onboardedAt) {
                window.location.replace("/onboarding/welcome");
                return;
            }
            window.location.replace(user.isSuperAdmin ? "/super-admin" : "/admin");
        } catch (reason) {
            if (val === "111111" || reason instanceof AuthApiError) {
                const n = attempts + 1;
                setAttempts(n);
                setCode("");
                if (n >= 3 || (reason instanceof AuthApiError && reason.lockedOut)) {
                    setErr("");
                    go("login");
                } else {
                    const left = 3 - n;
                    setErr(
                        reason instanceof Error && !reason.message.includes("attempt")
                            ? reason.message
                            : `That code isn’t right. ${left} attempt${
                                  left === 1 ? "" : "s"
                              } left before you’ll need to sign in again.`
                    );
                }
            }
        } finally {
            setVerifying(false);
        }
    };

    const handleResendChallenge = async () => {
        try {
            const res = await requestMfaChallenge(user.email);
            setDemoMfaCode(res.demo_code ?? null);
            setErr("");
        } catch (reason) {
            if (reason instanceof AuthApiError && reason.status === 401) {
                window.location.replace("/login");
                return;
            }

            setErr(reason instanceof Error ? reason.message : "Could not resend the verification code.");
        }
    };

    return (
        <AuthCardWrap>
            <Brand />
            <AuthCard
                icon="ShieldCheck"
                title="Verify it’s you"
                desc={
                    <>
                        Your role (<strong>{user.role}</strong>) requires a second step. Enter the
                        6-digit sign-in verification code.
                    </>
                }
            >
                <div className="flex flex-col gap-4.5">
                    {demoMfaCode && (
                        <Banner tone="info" title="Verification code">
                            <div className="flex items-center justify-between gap-2">
                                <span>
                                    Code:{" "}
                                    <strong className="font-bold text-indigo-700 tabular-nums">
                                        {demoMfaCode}
                                    </strong>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCode(demoMfaCode);
                                        setErr("");
                                        complete(demoMfaCode);
                                    }}
                                    className="cursor-pointer rounded-md bg-indigo-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-800"
                                >
                                    Auto-fill &amp; Verify
                                </button>
                            </div>
                        </Banner>
                    )}
                    <OTPInput
                        value={code}
                        onChange={(v) => {
                            setCode(v);
                            if (err) setErr("");
                        }}
                        onComplete={complete}
                        invalid={!!err}
                        autoFocus
                    />
                    {err && <Banner tone="red">{err}</Banner>}
                    {verifying && (
                        <div className="flex items-center justify-center gap-2 text-[13px] text-slate-500">
                            <AuthSpinner size={16} /> Verifying…
                        </div>
                    )}
                    <ResendRow
                        validity={120}
                        unlockAfter={5}
                        onResend={handleResendChallenge}
                    />
                    <div className="h-px bg-slate-100" />
                    <AuthSwitch
                        label="Remember this device for 30 days"
                        checked={remember}
                        onChange={setRemember}
                    />
                </div>
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-008 (part 1) — Pre-expiry inactivity warning modal.
export function SessionWarnScreen({
    go,
    onStaySignedIn,
}: {
    go: (id: AuthScreenId) => void;
    onStaySignedIn?: () => void;
}) {
    const cd = useCountdown(60);

    useEffect(() => {
        if (cd.t <= 0) {
            signOut()
                .catch(() => undefined)
                .finally(() => {
                    if (onStaySignedIn) {
                        window.location.replace("/session-expired?ended=1");
                    } else {
                        go("session");
                    }
                });
        }
    }, [cd.t, go, onStaySignedIn]);

    const handleStaySignedIn = async () => {
        try {
            await extendActiveSession();
        } catch {
            // ignore
        }
        cd.reset();
        if (onStaySignedIn) {
            onStaySignedIn();
        } else {
            go("dashboard");
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } finally {
            window.location.replace("/session-expired?ended=1");
        }
    };

    return (
        <div className="relative flex min-h-full flex-col items-center justify-center p-6">
            <div className="relative w-[420px] max-w-full rounded-xl border border-slate-200 bg-white p-7 shadow-xl">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-[#FEF3C7] text-[#D97706]">
                    <AuthIcon name="Clock" size={24} />
                </div>
                <div className="text-[18px] font-semibold text-slate-800">Still there?</div>
                <div className="mt-1.5 text-[14px] leading-[1.55] text-slate-500">
                    You’ll be signed out in{" "}
                    <strong className="font-semibold text-[#D97706] tabular-nums">
                        {cd.label}
                    </strong>{" "}
                    due to inactivity. Extend your session to keep working — nothing will be lost.
                </div>
                <div className="mt-5.5 flex gap-2.5">
                    <AuthButton size="lg" className="flex-1" onClick={handleStaySignedIn}>
                        Stay signed in
                    </AuthButton>
                    <AuthButton variant="secondary" size="lg" onClick={handleSignOut}>
                        Sign out
                    </AuthButton>
                </div>
            </div>
        </div>
    );
}

// AUTH-008 (part 2) — Session Expired.
export function SessionScreen({
    go,
}: {
    go: (id: AuthScreenId) => void;
}) {
    return (
        <AuthCardWrap>
            <Brand />
            <AuthCard
                icon="Clock"
                iconTone="amber"
                title="Your session ended"
                desc="You were signed out after a period of inactivity to keep your account secure."
            >
                <div className="flex flex-col gap-4.5">
                    <Banner tone="green" title="Nothing was lost">
                        Any class delivery you submitted was saved on our side — you can pick up
                        where you left off.
                    </Banner>
                    <AuthButton
                        size="lg"
                        className="w-full"
                        icon={<AuthIcon name="LogIn" size={18} />}
                        onClick={() => {
                            go("login");
                            window.location.replace("/login");
                        }}
                    >
                        Sign in again
                    </AuthButton>
                </div>
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-009 — Unauthorized Access.
export function UnauthorizedScreen({
    go,
    authed = false,
    dashboardHref = "/admin",
}: {
    go: (id: AuthScreenId) => void;
    authed?: boolean;
    dashboardHref?: string;
}) {
    return (
        <AuthCardWrap>
            <Brand />
            <AuthCard
                icon="ShieldAlert"
                iconTone="slate"
                title="You don’t have access to this"
                desc="This page isn’t available to your account. If you think this is a mistake, your Head of Department can review your access."
            >
                <div className="flex flex-col gap-3">
                    {authed ? (
                        <AuthButton
                            size="lg"
                            className="w-full"
                            icon={<AuthIcon name="LayoutDashboard" size={18} />}
                            onClick={() => {
                                window.location.replace(dashboardHref);
                            }}
                        >
                            Return to my dashboard
                        </AuthButton>
                    ) : (
                        <AuthButton
                            size="lg"
                            className="w-full"
                            icon={<AuthIcon name="LogIn" size={18} />}
                            onClick={() => {
                                go("login");
                                window.location.replace("/login");
                            }}
                        >
                            Sign in
                        </AuthButton>
                    )}
                    <AuthButton
                        variant="ghost"
                        size="md"
                        className="w-full"
                        icon={<AuthIcon name="Mail" size={16} />}
                        onClick={() => {
                            window.location.href =
                                "mailto:hod@example.com?subject=ERP%20Access%20Review";
                        }}
                    >
                        Contact your HoD
                    </AuthButton>
                </div>
            </AuthCard>
        </AuthCardWrap>
    );
}

// AUTH-010 — User Profile Setup (Onboarding Step 2 of 2, or My Profile in Account Settings).
export function ProfileScreen({
    user = DEFAULT_USER,
    onProfileUpdated,
    inDashboard = false,
}: {
    go?: (id: AuthScreenId) => void;
    user?: AuthUserSummary;
    onProfileUpdated?: (updated: CurrentUser) => void;
    inDashboard?: boolean;
}) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [nameOverride, setNameOverride] = useState<string | null>(null);
    const [phoneOverride, setPhoneOverride] = useState<string | null>(null);
    const [deptOverride, setDeptOverride] = useState<string | null>(null);
    const [avatarOverride, setAvatarOverride] = useState<string | null | undefined>(undefined);
    const [saving, setSaving] = useState(false);
    const [savedBanner, setSavedBanner] = useState(false);
    const [err, setErr] = useState("");

    const name = nameOverride ?? user.name;
    const phone = phoneOverride ?? user.phone ?? "";
    const dept = deptOverride ?? user.dept;
    const avatarUrl = avatarOverride !== undefined ? avatarOverride : user.avatarUrl;
    const phoneOk = /^[+\d][\d\s-]{7,}$/.test(phone.trim());

    const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setAvatarOverride(reader.result);
                setSavedBanner(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setErr("name");
            return;
        }
        if (!phoneOk) {
            setErr("phone");
            return;
        }
        setErr("");
        setSavedBanner(false);
        setSaving(true);
        try {
            const updated = await updateProfileSetup({
                name: name.trim(),
                phone: phone.trim(),
                department: dept.trim() || "Computer Science",
                avatar_url: avatarUrl ?? null,
            });
            onProfileUpdated?.(updated);
            if (inDashboard) {
                setSavedBanner(true);
            } else {
                const isSuperAdmin = updated.roles.some((r) => r.slug === "super-administrator");
                window.location.replace(isSuperAdmin ? "/super-admin" : "/admin");
            }
        } catch (reason) {
            setErr(reason instanceof Error ? reason.message : "Could not save your profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <AuthCardWrap>
            {!inDashboard && <Brand />}
            <AuthCard width={480}>
                {!inDashboard && <Stepper current={2} labels={["Welcome", "Your profile"]} />}
                <div className="text-[19px] font-semibold text-slate-800">
                    {inDashboard ? "Profile details" : "Complete your profile"}
                </div>
                <div className="mt-1.5 mb-5 text-[14px] leading-[1.55] text-slate-500">
                    Confirm how you’d like to appear and how we can reach you. Your role and
                    department were set by an administrator.
                </div>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    {savedBanner && (
                        <Banner tone="green" title="Profile updated">
                            Your profile details have been saved.
                        </Banner>
                    )}
                    <div className="flex items-center gap-4">
                        <Avatar name={name || user.name} avatarUrl={avatarUrl} size={64} />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoSelect}
                            className="hidden"
                        />
                        <AuthButton
                            variant="secondary"
                            size="sm"
                            type="button"
                            icon={<AuthIcon name="Upload" size={16} />}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatarUrl ? "Change photo" : "Add photo"}
                        </AuthButton>
                        {avatarUrl ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setAvatarOverride(null);
                                    setSavedBanner(false);
                                }}
                                className="cursor-pointer text-xs font-medium text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        ) : (
                            <span className="text-xs text-slate-400">Optional</span>
                        )}
                    </div>
                    <AuthFormField
                        label="Preferred name"
                        htmlFor="pf-name"
                        required
                        error={err === "name" ? "Enter a preferred name." : undefined}
                    >
                        <AuthInput
                            id="pf-name"
                            value={name}
                            invalid={err === "name"}
                            onChange={(e) => {
                                setNameOverride(e.target.value);
                                if (err) setErr("");
                                if (savedBanner) setSavedBanner(false);
                            }}
                        />
                    </AuthFormField>
                    <AuthFormField
                        label="Contact number"
                        htmlFor="pf-phone"
                        required
                        hint="Used for account recovery and urgent notices"
                        error={err === "phone" ? "Enter a valid contact number." : undefined}
                    >
                        <AuthInput
                            id="pf-phone"
                            type="tel"
                            value={phone}
                            invalid={err === "phone"}
                            placeholder="+91 98765 43210"
                            icon={<AuthIcon name="Phone" size={17} />}
                            onChange={(e) => {
                                setPhoneOverride(e.target.value);
                                if (err) setErr("");
                                if (savedBanner) setSavedBanner(false);
                            }}
                        />
                    </AuthFormField>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <ReadOnlyField label="Role" value={user.role} icon="BadgeCheck" />
                        <AuthFormField label="Department" htmlFor="pf-dept">
                            <AuthInput
                                id="pf-dept"
                                value={dept}
                                icon={<AuthIcon name="Building2" size={16} />}
                                onChange={(e) => {
                                    setDeptOverride(e.target.value);
                                    if (savedBanner) setSavedBanner(false);
                                }}
                            />
                        </AuthFormField>
                    </div>
                    <Banner tone="info" className="mt-0.5">
                        Role is assigned by a super administrator. Changes to your preferred name,
                        photo, contact number, and department take effect immediately.
                    </Banner>
                    {err && err !== "name" && err !== "phone" && (
                        <Banner tone="red">{err}</Banner>
                    )}
                    <AuthButton
                        type="submit"
                        size="lg"
                        className="w-full"
                        loading={saving}
                        iconRight={!saving ? <AuthIcon name="Check" size={18} /> : undefined}
                    >
                        {saving ? "Saving…" : inDashboard ? "Save changes" : "Save & continue"}
                    </AuthButton>
                </form>
            </AuthCard>
        </AuthCardWrap>
    );
}

const SCREEN_PATHS: Record<AuthScreenId, string> = {
    login: "/login",
    forgot: "/forgot-password",
    otp: "/verify-otp",
    reset: "/reset-password",
    change: "/security/change-password",
    firsttime: "/onboarding/welcome",
    profile: "/onboarding/profile",
    mfa: "/mfa",
    sessionwarn: "/session-expired?warn=1",
    session: "/session-expired",
    unauthorized: "/unauthorized",
    dashboard: "/admin",
};

/**
 * Standalone public/onboarding authentication flow (used on /login, /forgot-password, /verify-otp, /reset-password, /mfa, /onboarding/*, /session-expired, /unauthorized).
 */
export function StandaloneAuthView({ initialScreen }: { initialScreen: AuthScreenId }) {
    const [screen, setScreen] = useState<AuthScreenId>(initialScreen);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [recoveryEmail, setRecoveryEmail] = useState("");
    const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);
    const [verifiedCode, setVerifiedCode] = useState("");

    useEffect(() => {
        if (initialScreen === "mfa") {
            const cachedUser = getCachedAuthUser();
            if (!cachedUser) {
                window.location.replace("/login");
                return;
            }

            setCurrentUser(cachedUser);
            return;
        }

        getCurrentUser()
            .then((u) => {
                if (u) setCurrentUser(u);
            })
            .catch(() => undefined);
    }, []);

    const userSummary = toUserSummary(currentUser);

    const go = (next: AuthScreenId) => {
        if (next === "dashboard") {
            window.location.replace(userSummary.isSuperAdmin ? "/super-admin" : "/admin");
            return;
        }
        setScreen(next);
        if (typeof window !== "undefined" && SCREEN_PATHS[next]) {
            window.history.pushState(null, "", SCREEN_PATHS[next]);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800">
            {screen === "login" && <LoginScreen go={go} onAuthenticated={setCurrentUser} />}
            {screen === "forgot" && (
                <ForgotScreen
                    go={go}
                    recoveryEmail={recoveryEmail}
                    onRecoveryEmailChange={(em, code) => {
                        setRecoveryEmail(em);
                        setDemoOtpCode(code ?? null);
                    }}
                />
            )}
            {screen === "otp" && (
                <OTPScreen
                    go={go}
                    recoveryEmail={recoveryEmail}
                    demoOtpCode={demoOtpCode}
                    onVerifiedCode={(c) => setVerifiedCode(c)}
                    onNewDemoCode={(c) => setDemoOtpCode(c)}
                />
            )}
            {screen === "reset" && (
                <ResetScreen
                    go={go}
                    recoveryEmail={recoveryEmail}
                    verifiedCode={verifiedCode}
                />
            )}
            {screen === "change" && <ChangeScreen go={go} />}
            {screen === "firsttime" && <FirstTimeScreen go={go} user={userSummary} />}
            {screen === "profile" && (
                <ProfileScreen go={go} user={userSummary} onProfileUpdated={setCurrentUser} />
            )}
            {screen === "mfa" && <MfaScreen go={go} user={userSummary} />}
            {screen === "sessionwarn" && <SessionWarnScreen go={go} />}
            {screen === "session" && <SessionScreen go={go} />}
            {screen === "unauthorized" && (
                <UnauthorizedScreen
                    go={go}
                    authed={!!currentUser}
                    dashboardHref={userSummary.isSuperAdmin ? "/super-admin" : "/admin"}
                />
            )}
        </main>
    );
}

export type SecuritySectionId = "profile" | "change-password";

const ACCOUNT_SECTIONS: {
    id: SecuritySectionId;
    href: string;
    title: string;
    description: string;
}[] = [
    {
        id: "profile",
        href: "/security/profile",
        title: "My Profile",
        description: "Manage your personal details, department information, and sign-in security preferences.",
    },
    {
        id: "change-password",
        href: "/security/change-password",
        title: "Change Password",
        description: "Update your account password by confirming your current password.",
    },
];

/**
 * Inside-Dashboard Account Settings Workspace (ONLY My Profile & Change Password — no pre-login or recovery screens).
 */
export function DashboardSecurityWorkspace({
    section,
}: {
    section: SecuritySectionId;
    initialScreen?: AuthScreenId;
}) {
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [togglingMfa, setTogglingMfa] = useState(false);

    useEffect(() => {
        getCurrentUser()
            .then((u) => {
                if (u) {
                    setCurrentUser(u);
                }
            })
            .catch(() => undefined);
    }, []);

    const activeSection =
        ACCOUNT_SECTIONS.find((s) => s.id === section) ?? ACCOUNT_SECTIONS[0];
    const userSummary = toUserSummary(currentUser);

    const handleToggleMfa = async (enabled: boolean) => {
        if (!currentUser || togglingMfa) return;
        setTogglingMfa(true);
        try {
            const updated = await updateProfileSetup({ mfa_enabled: enabled });
            setCurrentUser(updated);
        } finally {
            setTogglingMfa(false);
        }
    };

    return (
        <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <p className="text-xs font-semibold tracking-wider text-indigo-700 uppercase">
                            Account Settings · {userSummary.role}
                        </p>
                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                            {activeSection.title}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">{activeSection.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                            <AuthSwitch
                                label={
                                    userSummary.mfaEnabled
                                        ? "Two-factor authentication (Active)"
                                        : "Two-factor authentication (MFA)"
                                }
                                checked={!!userSummary.mfaEnabled}
                                disabled={togglingMfa || !currentUser}
                                onChange={handleToggleMfa}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                    {ACCOUNT_SECTIONS.map((sec) => {
                        const isCurrentSection = sec.id === section;
                        return (
                            <Link
                                key={sec.id}
                                href={sec.href}
                                className={`inline-flex items-center rounded-lg px-4 py-2 text-xs font-semibold transition ${
                                    isCurrentSection
                                        ? "bg-indigo-700 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                                }`}
                            >
                                {sec.title}
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50/70 py-4">
                {section === "profile" ? (
                    <ProfileScreen
                        user={userSummary}
                        onProfileUpdated={setCurrentUser}
                        inDashboard
                    />
                ) : (
                    <ChangeScreen go={() => undefined} inDashboard />
                )}
            </section>
        </div>
    );
}
