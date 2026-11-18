import { StandaloneAuthView } from "@/features/auth/auth-screens";

export default function UnauthorizedPage() {
    return <StandaloneAuthView initialScreen="unauthorized" />;
}
