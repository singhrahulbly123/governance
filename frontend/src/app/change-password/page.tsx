import { AccessGate } from "@/features/administration/access-gate";
import { DashboardSecurityWorkspace } from "@/features/auth/auth-screens";

export default function ChangePasswordPage() {
    return (
        <AccessGate>
            <DashboardSecurityWorkspace section="change-password" initialScreen="change" />
        </AccessGate>
    );
}
