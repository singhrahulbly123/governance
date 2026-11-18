"use client";

import Link from "next/link";
import { useState } from "react";
import { application } from "@/config/application";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { signOut } from "@/services/api/auth";
import type { CurrentUser } from "@/types/auth";

export function AppHeader({
    user,
    onTriggerSessionWarning,
}: {
    user: CurrentUser;
    onTriggerSessionWarning?: () => void;
}) {
    const [signingOut, setSigningOut] = useState(false);

    async function handleSignOut() {
        if (signingOut) return;
        setSigningOut(true);

        try {
            await signOut();
        } finally {
            window.location.replace("/login");
        }
    }

    return (
        <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-indigo-700 uppercase">
                    {application.name}
                </p>
                <p className="mt-1 text-sm text-slate-500">Academic governance control centre</p>
            </div>
            <div className="flex items-center gap-3">
                <Link
                    href="/security/profile"
                    className="flex items-center gap-3 rounded-xl px-2.5 py-1.5 transition hover:bg-slate-100"
                    title="My Profile & Account Settings"
                >
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">
                            {user.department ? `${user.department} · ` : ""}
                            {user.email}
                        </p>
                    </div>
                    {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            className="size-9 rounded-full border border-slate-200 object-cover"
                        />
                    ) : (
                        <span className="grid size-9 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                            {user.name.slice(0, 1).toUpperCase()}
                        </span>
                    )}
                </Link>
                {onTriggerSessionWarning && (
                    <button
                        type="button"
                        onClick={onTriggerSessionWarning}
                        title="Session inactivity check"
                        className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex"
                    >
                        <span className="size-2 rounded-full bg-emerald-500" />
                        Session active
                    </button>
                )}
                <Button
                    className="hidden sm:inline-flex"
                    disabled={signingOut}
                    variant="secondary"
                    onClick={handleSignOut}
                >
                    {signingOut ? "Signing out…" : "Sign out"}
                </Button>
                <button
                    aria-label="Sign out"
                    className="text-slate-500 sm:hidden"
                    disabled={signingOut}
                    onClick={handleSignOut}
                >
                    <Icon name="settings" />
                </button>
            </div>
        </header>
    );
}
