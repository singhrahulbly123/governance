import { AccessGate } from "@/features/administration/access-gate";
import { DashApp } from "@/features/dashboard/dash-app";

export default function SuperAdministratorPage() {
    return (
        <AccessGate requiredRole="super-administrator" bare>
            <DashApp initialRole="faculty" initialRoute="users-roles" />
        </AccessGate>
    );
}
