import { AccessGate } from "@/features/administration/access-gate";
import { DashboardCard } from "@/features/administration/dashboard-card";

export default function SuperAdministratorPage() {
    return <AccessGate requiredRole="super-administrator"><p className="text-sm font-semibold tracking-widest text-indigo-700 uppercase">Super administrator</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Platform administration</h1><p className="mt-3 max-w-2xl text-slate-600">Manage platform-level roles, permissions and governance configuration.</p><section className="mt-8 grid gap-4 md:grid-cols-2"><DashboardCard title="Access control" description="Role and permission access is enforced by the Laravel API." /><DashboardCard title="Platform readiness" description="Complete infrastructure checks before enabling operational workflows." /></section></AccessGate>;
}
