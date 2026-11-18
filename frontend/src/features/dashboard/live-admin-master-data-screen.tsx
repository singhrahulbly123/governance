"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api/client";
import {
    Badge,
    Button,
    ContentCard,
    EmptyBlock,
    Grid,
    Icon,
    KpiRow,
    MetricCard,
    PageHeader,
} from "./dashboard-primitives";

type DashboardSummary = {
    totals: {
        faculty: number;
        departments: number;
        programs: number;
        academic_years: number;
    };
    departments: {
        id: number;
        code: string;
        name: string;
        is_active: boolean;
        faculty: number;
        programs: number;
    }[];
    current_academic_year: {
        name: string;
        starts_on: string;
        ends_on: string;
    } | null;
};

type Program = {
    id: number;
    name: string;
    code: string;
    department?: { name: string; code: string } | null;
};

type AcademicYear = {
    id: number;
    name: string;
    starts_on: string;
    ends_on: string;
    is_current: boolean;
};

function csvField(value: string | number): string {
    return `"${String(value).replaceAll('"', '""')}"`;
}

export function LiveAdminMasterDataScreen({ userName }: { userName?: string }) {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        async function loadMasterData(): Promise<void> {
            try {
                const [summaryResponse, programsResponse, yearsResponse] = await Promise.all([
                    apiRequest("/api/v1/dashboard/summary"),
                    apiRequest("/api/v1/programs"),
                    apiRequest("/api/v1/academic-years"),
                ]);
                if (!summaryResponse.ok || !programsResponse.ok || !yearsResponse.ok) {
                    throw new Error("Some institutional master data could not be loaded.");
                }

                const [summaryPayload, programPayload, yearPayload] = await Promise.all([
                    summaryResponse.json() as Promise<{ data: DashboardSummary }>,
                    programsResponse.json() as Promise<{ data: Program[] }>,
                    yearsResponse.json() as Promise<{ data: AcademicYear[] }>,
                ]);
                if (!cancelled) {
                    setSummary(summaryPayload.data);
                    setPrograms(programPayload.data ?? []);
                    setAcademicYears(yearPayload.data ?? []);
                }
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError instanceof Error ? loadError.message : "Could not load master data.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadMasterData();
        return () => { cancelled = true; };
    }, []);

    const currentYear = summary?.current_academic_year?.name
        ?? academicYears.find((year) => year.is_current)?.name
        ?? "Not configured";

    function exportMasterData(): void {
        if (!summary) return;
        const rows = [
            ["Record type", "Code", "Name", "Status", "Faculty", "Programs"],
            ...summary.departments.map((department) => [
                "Department",
                department.code,
                department.name,
                department.is_active ? "Active" : "Inactive",
                department.faculty,
                department.programs,
            ]),
            ...programs.map((program) => [
                "Program",
                program.code,
                program.name,
                "Active",
                "",
                "",
            ]),
            ...academicYears.map((year) => [
                "Academic year",
                "",
                year.name,
                year.is_current ? "Current" : "Archived",
                "",
                "",
            ]),
        ];
        const csv = rows.map((row) => row.map((field) => csvField(field)).join(",")).join("\r\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
        const link = document.createElement("a");
        link.href = url;
        link.download = "institutional-master-data.csv";
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div style={{ padding: 32, maxWidth: 1340, margin: "0 auto" }}>
            <PageHeader
                eyebrow="Administrator Workspace · Academic Master Data"
                title={`Welcome, ${userName || "Administrator"}`}
                sub="Institutional counts below come from the connected database."
                actions={<Button variant="secondary" icon={<Icon name="Download" size={17} color="var(--indigo-700)" />} onClick={exportMasterData} disabled={!summary}>Export master data CSV</Button>}
            />
            {error && <div role="alert" style={{ color: "var(--red-600)", marginBottom: 14 }}>{error}</div>}
            {loading || !summary ? (
                <ContentCard><EmptyBlock icon="Clock" title="Loading institutional records" desc="Connecting to the live API…" /></ContentCard>
            ) : (
                <>
                    <KpiRow>
                        <MetricCard label="Academic departments" value={summary.totals.departments} trend="flat" trendLabel="Database records" icon={<Icon name="Building2" size={18} color="var(--slate-400)" />} />
                        <MetricCard label="Degree programmes" value={summary.totals.programs} trend="flat" trendLabel="Database records" icon={<Icon name="BookOpen" size={18} color="var(--slate-400)" />} />
                        <MetricCard label="Current academic year" value={currentYear} trend="flat" trendLabel="Institution master data" icon={<Icon name="Calendar" size={18} color="var(--slate-400)" />} />
                        <MetricCard label="Faculty accounts" value={summary.totals.faculty} trend="flat" trendLabel="Active user accounts" icon={<Icon name="Users" size={18} color="var(--slate-400)" />} />
                    </KpiRow>

                    <Grid cols="1.4fr 1fr" style={{ marginTop: 20 }}>
                        <ContentCard title="Departments" padding="0" action={<Badge tone="brand">{summary.departments.length} records</Badge>}>
                            {summary.departments.length === 0 ? <EmptyBlock icon="Building2" title="No departments found" desc="Add departments to institutional master data to see them here." /> : summary.departments.map((department, index) => (
                                <div key={department.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderTop: index ? "1px solid var(--slate-100)" : "none" }}>
                                    <span style={{ width: 64, color: "var(--indigo-700)", fontSize: 12, fontWeight: 700 }}>{department.code}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}><div style={{ color: "var(--slate-800)", fontSize: 14, fontWeight: 600 }}>{department.name}</div><div style={{ color: "var(--slate-500)", fontSize: 12, marginTop: 3 }}>{department.faculty} faculty · {department.programs} programs</div></div>
                                    <Badge tone={department.is_active ? "green" : "neutral"}>{department.is_active ? "Active" : "Inactive"}</Badge>
                                </div>
                            ))}
                        </ContentCard>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <ContentCard title="Academic years">
                                {academicYears.length === 0 ? <EmptyBlock icon="Calendar" title="No academic years found" desc="Academic years will appear when they are added to master data." /> : academicYears.map((year, index) => <div key={year.id} style={{ padding: "12px 4px", borderTop: index ? "1px solid var(--slate-100)" : "none" }}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><strong style={{ color: "var(--slate-800)", fontSize: 14 }}>{year.name}</strong><Badge tone={year.is_current ? "green" : "neutral"}>{year.is_current ? "Current" : "Archived"}</Badge></div><div style={{ color: "var(--slate-500)", fontSize: 12, marginTop: 4 }}>{year.starts_on} – {year.ends_on}</div></div>)}
                            </ContentCard>
                            <ContentCard title="Programmes">
                                {programs.length === 0 ? <EmptyBlock icon="BookOpen" title="No programmes found" desc="Programmes will appear when they are linked to a department." /> : programs.map((program, index) => <div key={program.id} style={{ padding: "12px 4px", borderTop: index ? "1px solid var(--slate-100)" : "none" }}><strong style={{ color: "var(--slate-800)", fontSize: 14 }}>{program.name}</strong><div style={{ color: "var(--slate-500)", fontSize: 12, marginTop: 4 }}>{program.code}{program.department ? ` · ${program.department.name}` : ""}</div></div>)}
                            </ContentCard>
                        </div>
                    </Grid>
                </>
            )}
        </div>
    );
}
