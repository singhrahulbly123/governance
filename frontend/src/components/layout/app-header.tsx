"use client";

import { useRouter } from "next/navigation";
import { application } from "@/config/application";
import { Button } from "@/components/ui/button";
import { signOut } from "@/services/api/auth";
import type { CurrentUser } from "@/types/auth";

export function AppHeader({ user }: { user: CurrentUser }) {
    const router = useRouter();

    async function handleSignOut() {
        await signOut();
        router.replace("/login");
    }

    return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8"><p className="text-lg font-semibold tracking-tight text-slate-950">{application.name}</p><div className="flex items-center gap-3"><div className="hidden text-right text-sm sm:block"><p className="font-medium text-slate-900">{user.name}</p><p className="text-slate-500">{user.email}</p></div><Button variant="secondary" onClick={handleSignOut}>Sign out</Button></div></div></header>;
}
