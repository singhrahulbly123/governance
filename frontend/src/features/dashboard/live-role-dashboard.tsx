"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/services/api/client";
import type { DashboardRoleId } from "./dashboard-data";
import { Badge, ContentCard, EmptyBlock, PageHeader } from "./dashboard-primitives";

type Summary = {
    source: string;
    generated_at: string;
    totals: {
        users: number;
        active_users: number;
        faculty: number;
        unassigned_faculty: number;
        departments: number;
        active_departments: number;
        programs: number;
        active_programs: number;
        academic_years: number;
    };
    roles: { name: string; slug: string; users: number; active_users: number }[];
    departments: {
        id: number;
        code: string;
        name: string;
        is_active: boolean;
        programs: number;
        active_programs: number;
        faculty: number;
    }[];
    current_academic_year: { name: string; starts_on: string; ends_on: string } | null;
    data_availability: Record<string, boolean>;
};

const roleTitles: Record<DashboardRoleId, string> = {
    faculty: "Faculty Dashboard",
    visiting: "Visiting Faculty Dashboard",
    program: "Program Leader Dashboard",
    hod: "HoD Dashboard",
    dean: "Dean Dashboard",
    academic: "Academic Head Dashboard",
    management: "Management Dashboard",
    director: "Director Dashboard",
};

const metrics: { key: keyof Summary["totals"]; label: string }[] = [
    { key: "users", label: "Users" },
    { key: "active_users", label: "Active users" },
    { key: "faculty", label: "Faculty accounts" },
    { key: "departments", label: "Departments" },
    { key: "programs", label: "Programs" },
    { key: "academic_years", label: "Academic years" },
];

const moduleLabels: Record<string, string> = {
    courses: "Courses",
    students: "Students",
    class_sessions: "Class sessions",
    attendance: "Attendance",
    workload: "Workload",
    lesson_plans: "Lesson plans",
    audits: "Audits",
    approvals: "Approvals",
    notifications: "Notifications",
};

export function LiveRoleDashboard({ role }: { role: DashboardRoleId }) {
    const [summary, setSummary] = useState<Summary | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        apiRequest("/api/v1/dashboard/summary")
            .then(async (response) => {
                if (!response.ok) throw new Error("Dashboard summary unavailable");
                const payload = (await response.json()) as { data: Summary };
                if (!cancelled) setSummary(payload.data);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div style={{ padding: "28px 32px 48px", maxWidth: 1180, margin: "0 auto" }}>
            <PageHeader
                eyebrow="Live institutional data"
                title={roleTitles[role]}
                sub="Summary figures are read from the authenticated PostgreSQL API."
            />

            {error ? (
                <ContentCard>
                    <EmptyBlock
                        icon="Database"
                        title="Live dashboard data is unavailable"
                        desc="The API did not return the dashboard summary. Refresh after confirming your session and API connection."
                    />
                </ContentCard>
            ) : !summary ? (
                <ContentCard>
                    <EmptyBlock icon="Clock" title="Loading live data" desc="Connecting to the institutional database…" />
                </ContentCard>
            ) : (
                <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 20 }}>
                        {metrics.map(({ key, label }) => (
                            <ContentCard key={key} padding="18px">
                                <div style={{ color: "var(--slate-500)", fontSize: 13 }}>{label}</div>
                                <div style={{ color: "var(--slate-800)", fontSize: 28, fontWeight: 700, marginTop: 8 }}>{summary.totals[key]}</div>
                            </ContentCard>
                        ))}
                    </div>

                    <ContentCard title="Departments and programs" style={{ marginBottom: 20 }}>
                        {summary.departments.length === 0 ? (
                            <EmptyBlock title="No departments found" desc="Departments will appear here after they are added to master data." />
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                                    <thead><tr>{["Department", "Status", "Faculty", "Programs"].map((label) => <th key={label} style={{ padding: "12px 16px", color: "var(--slate-500)", fontSize: 12, borderBottom: "1px solid var(--slate-200)" }}>{label}</th>)}</tr></thead>
                                    <tbody>{summary.departments.map((department) => (
                                        <tr key={department.id}>
                                            <td style={{ padding: "14px 16px", color: "var(--slate-800)", borderBottom: "1px solid var(--slate-100)" }}>{department.name}</td>
                                            <td style={{ padding: "14px 16px", borderBottom: "1px solid var(--slate-100)" }}><Badge tone={department.is_active ? "green" : "neutral"}>{department.is_active ? "Active" : "Inactive"}</Badge></td>
                                            <td style={{ padding: "14px 16px", color: "var(--slate-700)", borderBottom: "1px solid var(--slate-100)" }}>{department.faculty}</td>
                                            <td style={{ padding: "14px 16px", color: "var(--slate-700)", borderBottom: "1px solid var(--slate-100)" }}>{department.programs}</td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        )}
                    </ContentCard>

                    <ContentCard title="Academic records">
                        {summary.current_academic_year && <p style={{ margin: "0 20px 16px", color: "var(--slate-700)" }}>Current academic year: <strong>{summary.current_academic_year.name}</strong></p>}
                        <EmptyBlock
                            icon="BookOpen"
                            title="Academic activity data is not available yet"
                            desc={`${Object.entries(summary.data_availability)
                                .filter(([module, available]) => moduleLabels[module] && !available)
                                .map(([module]) => moduleLabels[module])
                                .join(", ") || "Academic activity"} data will appear after those modules are connected and records are added.`}
                        />
                    </ContentCard>
                    <p style={{ marginTop: 12, color: "var(--slate-400)", fontSize: 12 }}>Source: {summary.source} · Updated {new Date(summary.generated_at).toLocaleString()}</p>
                </>
            )}
        </div>
    );
}
