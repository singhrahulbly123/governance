import { apiRequest, initializeCsrfProtection } from "@/services/api/client";
import type { CurrentUser, ForgotPasswordResult, MfaVerifyResult } from "@/types/auth";

type ApiPayload<T> = { data: T };

type ApiErrorPayload = {
    message?: string;
    code?: string;
    locked_out?: boolean;
    remaining_attempts?: number;
    errors?: Record<string, string[]>;
};

export class AuthApiError extends Error {
    status: number;
    code?: string;
    lockedOut?: boolean;
    remainingAttempts?: number;

    constructor(message: string, status: number, options?: { code?: string; lockedOut?: boolean; remainingAttempts?: number }) {
        super(message);
        this.name = "AuthApiError";
        this.status = status;
        this.code = options?.code;
        this.lockedOut = options?.lockedOut;
        this.remainingAttempts = options?.remainingAttempts;
    }
}

async function ensureCsrfCookie(): Promise<void> {
    if (typeof document !== "undefined" && !document.cookie.includes("XSRF-TOKEN=")) {
        await initializeCsrfProtection();
    }
}

async function parseError(response: Response, fallback: string): Promise<AuthApiError> {
    try {
        const body = (await response.json()) as ApiErrorPayload;
        const firstFieldError = body.errors ? Object.values(body.errors)[0]?.[0] : undefined;
        return new AuthApiError(firstFieldError ?? body.message ?? fallback, response.status, {
            code: body.code,
            lockedOut: body.locked_out,
            remainingAttempts: body.remaining_attempts,
        });
    } catch {
        return new AuthApiError(fallback, response.status);
    }
}

const CACHED_USER_STORAGE_KEY = "dia_thrive_cached_user";
let memoryCachedUser: CurrentUser | null = null;

export function getCachedAuthUser(): CurrentUser | null {
    if (memoryCachedUser) return memoryCachedUser;
    if (typeof window === "undefined") return null;
    try {
        const raw = window.sessionStorage.getItem(CACHED_USER_STORAGE_KEY);
        if (!raw) return null;
        memoryCachedUser = JSON.parse(raw) as CurrentUser;
        return memoryCachedUser;
    } catch {
        return null;
    }
}

export function setCachedAuthUser(user: CurrentUser | null): void {
    memoryCachedUser = user;
    if (typeof window === "undefined") return;
    try {
        if (user) {
            window.sessionStorage.setItem(
                CACHED_USER_STORAGE_KEY,
                JSON.stringify(user),
            );
        } else {
            window.sessionStorage.removeItem(CACHED_USER_STORAGE_KEY);
        }
    } catch {
        // Ignore storage quota errors
    }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const response = await apiRequest("/api/v1/user");

    if (response.status === 401) {
        setCachedAuthUser(null);
        return null;
    }

    if (!response.ok) {
        throw new Error("Could not load the signed-in user.");
    }

    const user = ((await response.json()) as ApiPayload<CurrentUser>).data;
    setCachedAuthUser(user);
    return user;
}

export async function signIn(email: string, password: string, remember: boolean): Promise<CurrentUser> {
    await initializeCsrfProtection();

    const response = await apiRequest("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
    });

    if (response.status === 403) {
        throw await parseError(response, "This account is inactive.");
    }

    if (!response.ok) {
        throw new AuthApiError("That email or password doesn’t match our records.", response.status);
    }

    const user = ((await response.json()) as ApiPayload<CurrentUser>).data;
    setCachedAuthUser(user);
    return user;
}

export async function signOut(): Promise<void> {
    setCachedAuthUser(null);
    await ensureCsrfCookie();
    await apiRequest("/api/v1/logout", { method: "POST" });
}

export async function requestPasswordResetCode(email: string): Promise<ForgotPasswordResult> {
    await ensureCsrfCookie();

    const response = await apiRequest("/api/v1/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw await parseError(response, "Enter a valid email address.");
    }

    return ((await response.json()) as ApiPayload<ForgotPasswordResult>).data;
}

export async function verifyPasswordResetOtp(email: string, code: string): Promise<void> {
    await ensureCsrfCookie();

    const response = await apiRequest("/api/v1/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email || undefined, code }),
    });

    if (!response.ok) {
        throw await parseError(response, "That code isn’t right. Check your email and try again.");
    }
}

export async function resetPasswordWithOtp(params: {
    email?: string;
    code?: string;
    password: string;
    passwordConfirmation: string;
}): Promise<void> {
    await ensureCsrfCookie();

    const response = await apiRequest("/api/v1/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: params.email || undefined,
            code: params.code || undefined,
            password: params.password,
            password_confirmation: params.passwordConfirmation,
        }),
    });

    if (!response.ok) {
        throw await parseError(response, "Your password doesn’t meet the requirements yet.");
    }
}

export async function changeCurrentPassword(params: {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
}): Promise<void> {
    await ensureCsrfCookie();

    const response = await apiRequest("/api/v1/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            current_password: params.currentPassword,
            password: params.password,
            password_confirmation: params.passwordConfirmation,
        }),
    });

    if (!response.ok) {
        throw await parseError(response, "Your current password isn’t correct.");
    }
}

export async function requestMfaChallenge(email?: string): Promise<{
    sent: boolean;
    expires_in_seconds: number;
    demo_code?: string | null;
}> {
    await ensureCsrfCookie();

    const response = await apiRequest("/api/v1/mfa/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw await parseError(response, "Could not generate an authenticator challenge.");
    }

    return ((await response.json()) as ApiPayload<{
        sent: boolean;
        expires_in_seconds: number;
        demo_code?: string | null;
    }>).data;
}

export async function verifyMfaChallenge(code: string, rememberDevice: boolean): Promise<MfaVerifyResult> {
    await ensureCsrfCookie();

    const response = await apiRequest("/api/v1/mfa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, remember_device: rememberDevice }),
    });

    if (!response.ok) {
        throw await parseError(response, "That code isn’t right.");
    }

    return ((await response.json()) as ApiPayload<MfaVerifyResult>).data;
}

export async function updateProfileSetup(params: {
    name?: string;
    phone?: string;
    department?: string;
    avatar_url?: string | null;
    mfa_enabled?: boolean;
}): Promise<CurrentUser> {
    await ensureCsrfCookie();

    const response = await apiRequest("/api/v1/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        throw await parseError(response, "Could not save your profile.");
    }

    const updatedUser = ((await response.json()) as ApiPayload<CurrentUser>).data;

    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent<CurrentUser>("dia-user-updated", { detail: updatedUser }));
    }

    return updatedUser;
}

export async function extendActiveSession(): Promise<void> {
    await ensureCsrfCookie();
    await apiRequest("/api/v1/session/extend", { method: "POST" });
}
