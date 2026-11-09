import { Icon } from "@/components/ui/icon";

type MetricIcon = "calendar" | "departments" | "people" | "programs" | "shield";

export function MetricCard({ accent = "indigo", icon, label, value }: { accent?: "emerald" | "indigo" | "sky" | "violet"; icon: MetricIcon; label: string; value: number | string }) {
    const accents = { emerald: "bg-emerald-50 text-emerald-700", indigo: "bg-indigo-50 text-indigo-700", sky: "bg-sky-50 text-sky-700", violet: "bg-violet-50 text-violet-700" };

    return <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p></div><span className={`grid size-10 place-items-center rounded-xl ${accents[accent]}`}><Icon name={icon} /></span></div></article>;
}
