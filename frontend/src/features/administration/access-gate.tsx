"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdministrationLayout } from "@/components/layout/administration-layout";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { AdministrationRole } from "@/types/auth";

export function AccessGate({ children, requiredRole }: { children: React.ReactNode; requiredRole: AdministrationRole }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useCurrentUser();

    useEffect(() => {
        if (loading) return;
        if (!user) { router.replace("/login"); return; }
    }, [loading, router, user]);

    if (loading || !user) return <main className="grid min-h-screen place-items-center text-sm text-slate-600">Loading administration workspace…</main>;

    const roles = user.roles.map((role) => role.slug);
    const hasAccess = requiredRole === "administrator"
        ? roles.includes("administrator") || roles.includes("super-administrator")
        : roles.includes("super-administrator");

    if (!hasAccess) {
        return <main className="grid min-h-screen place-items-center px-6"><div className="max-w-md text-center"><p className="text-sm font-semibold tracking-widest text-indigo-700 uppercase">Access restricted</p><h1 className="mt-2 text-2xl font-semibold text-slate-950">You do not have access to this workspace.</h1><p className="mt-3 text-sm leading-6 text-slate-600">Contact a super administrator if you need a different role or permission.</p></div></main>;
    }

    return <AdministrationLayout currentPath={pathname} user={user}>{children}</AdministrationLayout>;
}
