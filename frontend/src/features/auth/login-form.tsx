"use client";

import { StandaloneAuthView } from "@/features/auth/auth-screens";

export function LoginForm() {
    return <StandaloneAuthView initialScreen="login" />;
}
