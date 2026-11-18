"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, setCachedAuthUser } from "@/services/api/auth";
import type { CurrentUser } from "@/types/auth";

export const AuthenticatedUserContext = createContext<CurrentUser | null>(null);

export function useCurrentUser() {
    const contextUser = useContext(AuthenticatedUserContext);
    const [user, setUser] = useState<CurrentUser | null>(contextUser);
    const [loading, setLoading] = useState<boolean>(contextUser === null);

    useEffect(() => {
        if (contextUser) return;

        getCurrentUser()
            .then((fresh) => {
                setUser(fresh);
            })
            .catch(() => {
                setCachedAuthUser(null);
                setUser(null);
            })
            .finally(() => setLoading(false));

        const handleUserUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<CurrentUser>;
            if (customEvent.detail) {
                setCachedAuthUser(customEvent.detail);
                setUser(customEvent.detail);
            }
        };

        window.addEventListener("dia-user-updated", handleUserUpdated);
        return () =>
            window.removeEventListener("dia-user-updated", handleUserUpdated);
    }, [contextUser]);

    return {
        user: contextUser ?? user,
        loading: contextUser ? false : loading,
    };
}
