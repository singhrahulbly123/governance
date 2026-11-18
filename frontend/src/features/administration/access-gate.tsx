"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdministrationLayout } from "@/components/layout/administration-layout";
import { UnauthorizedScreen } from "@/features/auth/auth-screens";
import {
    AuthenticatedUserContext,
    useCurrentUser,
} from "@/hooks/use-current-user";
import type { AdministrationRole } from "@/types/auth";

export function AccessGate({
    children,
    requiredRole = "any",
    bare = false,
}: {
    children: React.ReactNode;
    requiredRole?: AdministrationRole | "any";
    bare?: boolean;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useCurrentUser();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace("/login");
            return;
        }
        const isSuperAdmin = user.roles.some(
            (role) => role.slug === "super-administrator",
        );
        if (requiredRole === "administrator" && isSuperAdmin) {
            router.replace("/super-admin");
            return;
        }
        if (requiredRole === "super-administrator" && !isSuperAdmin) {
            router.replace("/admin");
        }
    }, [loading, requiredRole, router, user]);

    if (loading || !user) {
        return (
            <main className="grid min-h-screen place-items-center text-sm text-slate-600">
                Loading administration workspace…
            </main>
        );
    }

    const roles = user.roles.map((role) => role.slug);
    const isSuperAdmin = roles.includes("super-administrator");

    if (requiredRole === "administrator" && isSuperAdmin) {
        return (
            <main className="grid min-h-screen place-items-center text-sm text-slate-600">
                Loading administration workspace…
            </main>
        );
    }

    if (requiredRole === "super-administrator" && !isSuperAdmin) {
        return (
            <main className="grid min-h-screen place-items-center text-sm text-slate-600">
                Redirecting to your role dashboard…
            </main>
        );
    }

    const hasAccess =
        requiredRole === "super-administrator"
            ? isSuperAdmin
            : user.is_active !== false && roles.length > 0;

    if (!hasAccess) {
        return (
            <main className="min-h-screen bg-slate-50 text-slate-800">
                <UnauthorizedScreen
                    go={() => router.replace("/login")}
                    authed
                    dashboardHref={isSuperAdmin ? "/super-admin" : "/admin"}
                />
            </main>
        );
    }

    if (bare) {
        return (
            <AuthenticatedUserContext.Provider value={user}>
                {children}
            </AuthenticatedUserContext.Provider>
        );
    }

    return (
        <AuthenticatedUserContext.Provider value={user}>
            <AdministrationLayout currentPath={pathname} user={user}>
                {children}
            </AdministrationLayout>
        </AuthenticatedUserContext.Provider>
    );
}
