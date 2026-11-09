import { AccessGate } from "@/features/administration/access-gate";
import { DashboardCard } from "@/features/administration/dashboard-card";

const cards = [
    ["Academic foundations", "Departments, programmes and academic years are available through the Laravel API."],
    ["Your access", "Administrator permissions control access to approved academic master data."],
    ["Next workflow", "Enable governance workflows only after their rules and approval paths are defined."],
];

export default function AdministratorPage() {
    return <AccessGate requiredRole="administrator"><p className="text-sm font-semibold tracking-widest text-indigo-700 uppercase">Administrator</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Academic governance workspace</h1><p className="mt-3 max-w-2xl text-slate-600">Manage approved academic master data and review governance operations.</p><section className="mt-8 grid gap-4 md:grid-cols-3">{cards.map(([title, description]) => <DashboardCard key={title} title={title} description={description} />)}</section></AccessGate>;
}
