import { application } from "@/config/application";

function csrfToken(): string | null {
    const token = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

    return token ? decodeURIComponent(token) : null;
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

    return fetch(`${application.apiUrl}${path}`, {
        credentials: "include",
        ...options,
        headers,
    });
}

export async function initializeCsrfProtection(): Promise<void> {
    await apiRequest("/sanctum/csrf-cookie");
}
