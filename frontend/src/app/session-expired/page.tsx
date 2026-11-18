"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { StandaloneAuthView } from "@/features/auth/auth-screens";

function SessionExpiredContent() {
    const searchParams = useSearchParams();
    const isWarn = searchParams.get("warn") === "1";

    return <StandaloneAuthView initialScreen={isWarn ? "sessionwarn" : "session"} />;
}

export default function SessionExpiredPage() {
    return (
        <Suspense fallback={<StandaloneAuthView initialScreen="session" />}>
            <SessionExpiredContent />
        </Suspense>
    );
}
