import { AccessGate } from "@/features/administration/access-gate";
import { DashApp } from "@/features/dashboard/dash-app";

export default function SecurityChangePasswordPage() {
    return (
        <AccessGate bare>
            <DashApp initialRoute="change-password" />
        </AccessGate>
    );
}
