"use client";

import { useRouter } from "next/navigation";
import { application } from "@/config/application";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { signOut } from "@/services/api/auth";
import type { CurrentUser } from "@/types/auth";

export function AppHeader({ user }: { user: CurrentUser }) {
    const router = useRouter();

    async function handleSignOut() {
        await signOut();
        router.replace("/login");
    }

    return <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">{application.name}</p><p className="mt-1 text-sm text-slate-500">Academic governance control centre</p></div><div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-900">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div><span className="grid size-9 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">{user.name.slice(0, 1).toUpperCase()}</span><Button className="hidden sm:inline-flex" variant="secondary" onClick={handleSignOut}>Sign out</Button><button aria-label="Sign out" className="text-slate-500 sm:hidden" onClick={handleSignOut}><Icon name="settings" /></button></div></header>;
}
