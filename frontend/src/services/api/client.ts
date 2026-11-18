import { application } from "@/config/application";

function resolveApiUrl(): string {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (typeof window !== "undefined" && window.location.hostname === "127.0.0.1") {
        return "http://127.0.0.1:8000";
    }
    return application.apiUrl;
}

function csrfToken(): string | null {
    const cookie = document.cookie
        .split("; ")
        .find((entry) => entry.startsWith("XSRF-TOKEN="));

    return cookie ? decodeURIComponent(cookie.slice("XSRF-TOKEN=".length)) : null;
}

export async function apiRequest(path: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set("Accept", "application/json");

    if (options.method && !["GET", "HEAD", "OPTIONS"].includes(options.method)) {
        const token = csrfToken();

        if (token) {
            headers.set("X-XSRF-TOKEN", token);
        }
    }

    return fetch(`${resolveApiUrl()}${path}`, {
        credentials: "include",
        ...options,
        headers,
    });
}

export async function initializeCsrfProtection(): Promise<void> {
    await apiRequest("/sanctum/csrf-cookie");
}
