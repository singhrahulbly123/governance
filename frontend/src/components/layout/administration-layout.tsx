"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AdministrationNavigation } from "@/components/layout/administration-navigation";
import { SessionWarnScreen } from "@/features/auth/auth-screens";
import type { CurrentUser } from "@/types/auth";

const IDLE_WARNING_MS = 14 * 60 * 1000; // 14 minutes of inactivity triggers the 60s warning modal

export function AdministrationLayout({
    children,
    currentPath,
    user,
}: {
    children: React.ReactNode;
    currentPath: string;
    user: CurrentUser;
}) {
    const [showIdleWarning, setShowIdleWarning] = useState(false);

    useEffect(() => {
        if (showIdleWarning) return;

        let timer = window.setTimeout(() => {
            setShowIdleWarning(true);
        }, IDLE_WARNING_MS);

        const resetIdleTimer = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                setShowIdleWarning(true);
            }, IDLE_WARNING_MS);
        };

        const events = ["mousedown", "keydown", "scroll", "touchstart"] as const;
        events.forEach((ev) => window.addEventListener(ev, resetIdleTimer, { passive: true }));

        return () => {
            window.clearTimeout(timer);
            events.forEach((ev) => window.removeEventListener(ev, resetIdleTimer));
        };
    }, [showIdleWarning]);

    return (
        <div className="min-h-screen bg-slate-100 lg:pl-64">
            <AdministrationNavigation currentPath={currentPath} user={user} />
            <div className="min-h-screen">
                <AppHeader
                    user={user}
                    onTriggerSessionWarning={() => setShowIdleWarning(true)}
                />
                <main className="mx-auto max-w-7xl p-5 sm:p-8">{children}</main>
            </div>

            {showIdleWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs">
                    <SessionWarnScreen
                        go={() => {
                            window.location.replace("/session-expired?ended=1");
                        }}
                        onStaySignedIn={() => setShowIdleWarning(false)}
                    />
                </div>
            )}
        </div>
    );
}
