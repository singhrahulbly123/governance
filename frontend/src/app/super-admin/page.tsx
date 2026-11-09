import { AccessGate } from "@/features/administration/access-gate";
import { SuperAdministratorDashboard } from "@/features/administration/super-administrator-dashboard";

export default function SuperAdministratorPage() {
    return <AccessGate requiredRole="super-administrator"><SuperAdministratorDashboard /></AccessGate>;
}
