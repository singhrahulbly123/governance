import { AccessGate } from "@/features/administration/access-gate";
import { DashApp } from "@/features/dashboard/dash-app";

export default function SecurityProfilePage() {
    return (
        <AccessGate bare>
            <DashApp initialRoute="profile" />
        </AccessGate>
    );
}
