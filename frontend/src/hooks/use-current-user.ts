"use client";

import { useEffect, useState } from "react";
import { getCurrentUser } from "@/services/api/auth";
import type { CurrentUser } from "@/types/auth";

export function useCurrentUser() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    return { user, loading };
}
