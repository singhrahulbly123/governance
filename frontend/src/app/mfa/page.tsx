import { StandaloneAuthView } from "@/features/auth/auth-screens";

export default function MfaPage() {
    return <StandaloneAuthView initialScreen="mfa" />;
}
