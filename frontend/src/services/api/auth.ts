import { apiRequest, initializeCsrfProtection } from "@/services/api/client";
import type { CurrentUser } from "@/types/auth";

type ApiPayload<T> = { data: T };

export async function getCurrentUser(): Promise<CurrentUser | null> {
    const response = await apiRequest("/api/v1/user");

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Could not load the signed-in user.");
    }

    return ((await response.json()) as ApiPayload<CurrentUser>).data;
}

export async function signIn(email: string, password: string, remember: boolean): Promise<CurrentUser> {
    await initializeCsrfProtection();

    const response = await apiRequest("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
    });

    if (!response.ok) {
        throw new Error("The email address or password is incorrect.");
    }

    return ((await response.json()) as ApiPayload<CurrentUser>).data;
}

export async function signOut(): Promise<void> {
    await apiRequest("/api/v1/logout", { method: "POST" });
}
