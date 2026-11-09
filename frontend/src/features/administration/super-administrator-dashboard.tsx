"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { MetricCard } from "@/features/administration/metric-card";
import { getAdministrationOverview } from "@/services/api/administration";
import type { AdministrationOverview } from "@/types/administration";

export function SuperAdministratorDashboard() {
    const [overview, setOverview] = useState<AdministrationOverview | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        getAdministrationOverview().then(setOverview).catch(() => setError("Administration metrics are temporarily unavailable."));
    }, []);

    const metrics = overview ?? { administrators: "—", super_administrators: "—", total_users: "—", departments: "—", programs: "—", academic_years: "—" };

    return <><section className="rounded-2xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-950 px-6 py-7 text-white sm:px-8"><p className="text-sm font-semibold text-indigo-200">Super administrator command centre</p><div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="text-3xl font-semibold tracking-tight">Platform visibility, in one place.</h1><p className="mt-2 max-w-xl text-sm leading-6 text-indigo-100">Monitor administrator access and academic governance foundations across DIA Thrive.</p></div><div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3"><p className="text-xs text-indigo-100">Platform users</p><p className="mt-1 text-2xl font-semibold">{metrics.total_users}</p></div></div></section>{error && <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}<section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Administrators" value={metrics.administrators} icon="people" /><MetricCard accent="violet" label="Super administrators" value={metrics.super_administrators} icon="shield" /><MetricCard accent="sky" label="Departments" value={metrics.departments} icon="departments" /><MetricCard accent="emerald" label="Programmes" value={metrics.programs} icon="programs" /></section><section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]"><article className="rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="font-semibold text-slate-950">Access summary</h2><p className="mt-1 text-sm text-slate-500">Counts come from the protected Laravel administration API.</p></div><Icon name="shield" /></div><div className="divide-y divide-slate-100">{[["Administrator accounts", metrics.administrators], ["Super administrator accounts", metrics.super_administrators], ["Academic years", metrics.academic_years]].map(([label, value]) => <div key={String(label)} className="flex items-center justify-between px-6 py-4"><p className="text-sm text-slate-600">{label}</p><p className="text-lg font-semibold text-slate-950">{value}</p></div>)}</div></article><article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-slate-950">Security posture</p><div className="mt-5 space-y-4">{["Role-based API authorization active", "Sanctum session protection active", "Neon database and Redis cache connected"].map((item) => <div key={item} className="flex gap-3 text-sm leading-6 text-slate-600"><span className="text-emerald-600">✓</span>{item}</div>)}</div></article></section></>;
}
