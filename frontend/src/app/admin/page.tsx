import { AccessGate } from "@/features/administration/access-gate";
import { DashApp } from "@/features/dashboard/dash-app";

export default function AdministratorPage() {
    return (
        <AccessGate requiredRole="administrator" bare>
            <DashApp initialRole="faculty" />
        </AccessGate>
    );
}
