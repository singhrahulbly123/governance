"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/services/api/client";
import { useDashboard } from "./dashboard-context";
import {
    Badge,
    Button,
    ContentCard,
    Grid,
    Icon,
    KpiRow,
    MetricCard,
    PageHeader,
    RAGBar,
} from "./dashboard-primitives";

type ApiDepartment = {
    id: number;
    name: string;
    code: string;
    description?: string | null;
};

type ApiProgram = {
    id: number;
    name: string;
    code: string;
    duration_years?: number;
    department?: {
        name: string;
        code: string;
    } | null;
};

type ApiAcademicYear = {
    id: number;
    name: string;
    starts_on: string;
    ends_on: string;
    is_current: boolean;
};

export function AdminMasterDataScreen({
    userName,
    onToast,
}: {
    userName?: string;
    onToast: (msg: string) => void;
}) {
    const { dash, exportCsvReport } = useDashboard();
    const [departments, setDepartments] = useState<ApiDepartment[]>([]);
    const [programs, setPrograms] = useState<ApiProgram[]>([]);
    const [academicYears, setAcademicYears] = useState<ApiAcademicYear[]>([]);
    const [verifiedItems, setVerifiedItems] = useState<string[]>([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [deptRes, progRes, yearRes] = await Promise.all([
                    apiRequest("/api/v1/departments"),
                    apiRequest("/api/v1/programs"),
                    apiRequest("/api/v1/academic-years"),
                ]);
                if (!cancelled && deptRes.ok) {
                    const j = (await deptRes.json()) as {
                        data: ApiDepartment[];
                    };
                    setDepartments(j.data ?? []);
                }
                if (!cancelled && progRes.ok) {
                    const j = (await progRes.json()) as { data: ApiProgram[] };
                    setPrograms(j.data ?? []);
                }
                if (!cancelled && yearRes.ok) {
                    const j = (await yearRes.json()) as {
                        data: ApiAcademicYear[];
                    };
                    setAcademicYears(j.data ?? []);
                }
            } catch {
                // Fallback to dashboard master data if offline
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const currentYear =
        academicYears.find((y) => y.is_current)?.name ?? "2025–2026";

    const checklist = [
        {
            id: "chk-dept",
            title: "Verify department master records & HoD mappings",
            sub: `${departments.length || dash.departments.length} academic departments active for ${currentYear}`,
        },
        {
            id: "chk-prog",
            title: "Confirm programme intake & semester structure",
            sub: `${programs.length || 6} degree programmes configured`,
        },
        {
            id: "chk-year",
            title: "Lock current academic year & examination window",
            sub: `Active cycle: ${currentYear} (${dash.institution.term})`,
        },
    ];

    const toggleVerify = (id: string, title: string) => {
        const exists = verifiedItems.includes(id);
        setVerifiedItems((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
        onToast(
            exists
                ? `Reopened: ${title}`
                : `Verified master data item: ${title}`,
        );
    };

    return (
        <div style={{ padding: 32, maxWidth: 1340, margin: "0 auto" }}>
            <PageHeader
                eyebrow="Administrator Workspace · Academic Master Data"
                title={`Welcome, ${userName || "Administrator"}`}
                sub="Manage institutional departments, academic programmes, academic year calendars, and operational governance records."
                actions={
                    <Button
                        variant="secondary"
                        size="md"
                        icon={
                            <Icon
                                name="Download"
                                size={17}
                                color="var(--indigo-700)"
                            />
                        }
                        onClick={() => exportCsvReport("admin-master-data")}
                    >
                        Export Master Data CSV
                    </Button>
                }
            />

            <KpiRow>
                <MetricCard
                    label="Academic departments"
                    value={departments.length || dash.departments.length}
                    trend="flat"
                    trendLabel="Active in ERP"
                    icon={
                        <Icon
                            name="Building2"
                            size={18}
                            color="var(--slate-400)"
                        />
                    }
                />
                <MetricCard
                    label="Degree programmes"
                    value={programs.length || 6}
                    trend="up"
                    trendLabel="Mapped to departments"
                    icon={
                        <Icon
                            name="BookOpen"
                            size={18}
                            color="var(--slate-400)"
                        />
                    }
                />
                <MetricCard
                    label="Current academic year"
                    value={currentYear}
                    trend="flat"
                    trendLabel={dash.institution.term}
                    icon={
                        <Icon
                            name="Calendar"
                            size={18}
                            color="var(--slate-400)"
                        />
                    }
                />
                <MetricCard
                    label="Faculty records tracked"
                    value={dash.totalFaculty}
                    trend="up"
                    trendLabel="Across all departments"
                    icon={
                        <Icon name="Users" size={18} color="var(--slate-400)" />
                    }
                />
            </KpiRow>

            <Grid cols="1.4fr 1fr" style={{ marginTop: 20 }}>
                <ContentCard
                    title="Departments Master Directory"
                    padding="0"
                    action={
                        <Badge tone="brand">
                            {dash.departments.length} departments
                        </Badge>
                    }
                >
                    <div>
                        {dash.departments.map((d, i) => (
                            <div
                                key={d.short}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: "14px 20px",
                                    borderTop: i
                                        ? "1px solid var(--slate-100)"
                                        : "none",
                                }}
                            >
                                <span
                                    style={{
                                        width: 58,
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: "var(--indigo-700)",
                                    }}
                                >
                                    {d.short}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color: "var(--slate-800)",
                                        }}
                                    >
                                        {d.name}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 12,
                                            color: "var(--slate-500)",
                                            marginTop: 2,
                                        }}
                                    >
                                        {d.faculty} faculty · Audit score{" "}
                                        {d.audit}/100
                                    </div>
                                </div>
                                <div style={{ width: 120 }}>
                                    <RAGBar
                                        data={d.rag}
                                        height={7}
                                        showLegend={false}
                                    />
                                </div>
                                <Badge tone="green">{d.coverage}% cov</Badge>
                            </div>
                        ))}
                    </div>
                </ContentCard>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                    }}
                >
                    <ContentCard title="Administrator Governance Checklist">
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}
                        >
                            {checklist.map((item) => {
                                const done = verifiedItems.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 12,
                                            padding: 12,
                                            borderRadius: "var(--radius-md)",
                                            border: "1px solid var(--slate-200)",
                                            background: done
                                                ? "var(--green-fill)"
                                                : "var(--slate-50)",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: "var(--slate-800)",
                                                }}
                                            >
                                                {item.title}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    color: "var(--slate-500)",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {item.sub}
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant={
                                                done ? "secondary" : "primary"
                                            }
                                            onClick={() =>
                                                toggleVerify(
                                                    item.id,
                                                    item.title,
                                                )
                                            }
                                        >
                                            {done ? "Verified ✓" : "Verify"}
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </ContentCard>

                    <ContentCard title="Academic Years & Programmes">
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {(academicYears.length > 0
                                ? academicYears
                                : [
                                      {
                                          id: 1,
                                          name: "2025–2026",
                                          starts_on: "2025-07-01",
                                          ends_on: "2026-06-30",
                                          is_current: true,
                                      },
                                  ]
                            ).map((yr) => (
                                <div
                                    key={yr.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 14px",
                                        border: "1px solid var(--slate-200)",
                                        borderRadius: "var(--radius-md)",
                                    }}
                                >
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "var(--slate-800)",
                                            }}
                                        >
                                            AY {yr.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: "var(--slate-500)",
                                            }}
                                        >
                                            {yr.starts_on} → {yr.ends_on}
                                        </div>
                                    </div>
                                    <Badge
                                        tone={
                                            yr.is_current ? "green" : "neutral"
                                        }
                                    >
                                        {yr.is_current
                                            ? "Current Year"
                                            : "Archived"}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </ContentCard>
                </div>
            </Grid>
        </div>
    );
}
