"use client";

import React, { useCallback, useEffect, useState } from "react";
import { apiRequest, initializeCsrfProtection } from "@/services/api/client";
import {
    Avatar,
    Badge,
    Button,
    ContentCard,
    Grid,
    Icon,
    Input,
    KpiRow,
    MetricCard,
    PageHeader,
} from "./dashboard-primitives";

export type ManagedRole = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    users_count?: number;
};

export type ManagedUser = {
    id: number;
    name: string;
    email: string;
    department: string;
    is_active: boolean;
    mfa_enabled: boolean;
    onboarded_at?: string | null;
    roles: ManagedRole[];
};

const DASHBOARD_SCREEN_MAP: Record<string, string> = {
    "super-administrator": "All 8 Dashboards + Super Admin",
    administrator: "All 8 Dashboards + Admin",
    faculty: "DASH-001 · Faculty",
    visiting: "DASH-002 · Visiting Faculty",
    program: "DASH-003 · Program Leader",
    hod: "DASH-004 · HoD Command Center",
    dean: "DASH-005 · Dean",
    academic: "DASH-006 · Academic Head",
    management: "DASH-007 · Management",
    director: "DASH-008 · Director",
};

async function ensureCsrf() {
    if (
        typeof document !== "undefined" &&
        !document.cookie.includes("XSRF-TOKEN=")
    ) {
        await initializeCsrfProtection();
    }
}

export function UsersRolesScreen({
    onToast,
}: {
    onToast: (msg: string) => void;
}) {
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [roles, setRoles] = useState<ManagedRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [createUserOpen, setCreateUserOpen] = useState(false);
    const [editUser, setEditUser] = useState<ManagedUser | null>(null);
    const [createRoleOpen, setCreateRoleOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state for Create / Edit User
    const [formName, setFormName] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formPassword, setFormPassword] = useState("RahulSingh123!");
    const [formDept, setFormDept] = useState(
        "CSE · Computer Science & Engineering",
    );
    const [formRoles, setFormRoles] = useState<string[]>(["faculty"]);
    const [formActive, setFormActive] = useState(true);

    // Form state for Create Role
    const [roleName, setRoleName] = useState("");
    const [roleSlug, setRoleSlug] = useState("");
    const [roleDesc, setRoleDesc] = useState("");

    const loadData = useCallback(async () => {
        try {
            const res = await apiRequest("/api/v1/administration/users");
            if (res.ok) {
                const json = (await res.json()) as {
                    data: { users: ManagedUser[]; roles: ManagedRole[] };
                };
                setUsers(json.data.users);
                setRoles(json.data.roles);
            }
        } catch {
            onToast("Could not load users and roles from backend.");
        } finally {
            setLoading(false);
        }
    }, [onToast]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await apiRequest("/api/v1/administration/users");
                if (res.ok && !cancelled) {
                    const json = (await res.json()) as {
                        data: { users: ManagedUser[]; roles: ManagedRole[] };
                    };
                    setUsers(json.data.users);
                    setRoles(json.data.roles);
                }
            } catch {
                if (!cancelled) {
                    onToast("Could not load users and roles from backend.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [onToast]);

    const openCreateUser = () => {
        setFormName("");
        setFormEmail("");
        setFormPassword("RahulSingh123!");
        setFormDept("CSE · Computer Science & Engineering");
        setFormRoles(["faculty"]);
        setFormActive(true);
        setCreateUserOpen(true);
    };

    const openEditUser = (u: ManagedUser) => {
        setFormName(u.name);
        setFormEmail(u.email);
        setFormPassword("");
        setFormDept(u.department || "CSE · Computer Science & Engineering");
        setFormRoles(
            u.roles.length > 0 ? u.roles.map((r) => r.slug) : ["faculty"],
        );
        setFormActive(u.is_active);
        setEditUser(u);
    };

    const toggleFormRole = (slug: string) => {
        setFormRoles((prev) =>
            prev.includes(slug)
                ? prev.length > 1
                    ? prev.filter((s) => s !== slug)
                    : prev
                : [...prev, slug],
        );
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
            onToast("Name, Email, and Password are required.");
            return;
        }
        setSaving(true);
        try {
            await ensureCsrf();
            const res = await apiRequest("/api/v1/administration/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formName.trim(),
                    email: formEmail.trim(),
                    password: formPassword,
                    department: formDept.trim(),
                    role_slugs: formRoles,
                    is_active: formActive,
                }),
            });
            if (!res.ok) {
                const err = (await res.json()) as { message?: string };
                onToast(err.message || "Could not create user.");
                return;
            }
            setCreateUserOpen(false);
            onToast(
                `Created user ${formName} (${formEmail}) with role: ${formRoles.join(", ")}`,
            );
            await loadData();
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        setSaving(true);
        try {
            await ensureCsrf();
            const res = await apiRequest(
                `/api/v1/administration/users/${editUser.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: formName.trim(),
                        email: formEmail.trim(),
                        ...(formPassword.trim()
                            ? { password: formPassword.trim() }
                            : {}),
                        department: formDept.trim(),
                        role_slugs: formRoles,
                        is_active: formActive,
                    }),
                },
            );
            if (!res.ok) {
                const err = (await res.json()) as { message?: string };
                onToast(err.message || "Could not update user.");
                return;
            }
            setEditUser(null);
            onToast(`Updated ${formName}'s account and roles.`);
            await loadData();
        } finally {
            setSaving(false);
        }
    };

    const handleQuickRoleChange = async (
        user: ManagedUser,
        newRoleSlug: string,
    ) => {
        try {
            await ensureCsrf();
            const res = await apiRequest(
                `/api/v1/administration/users/${user.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        role_slugs: [newRoleSlug],
                    }),
                },
            );
            if (res.ok) {
                const roleLabel =
                    roles.find((r) => r.slug === newRoleSlug)?.name ??
                    newRoleSlug;
                onToast(`Assigned role "${roleLabel}" to ${user.name}`);
                await loadData();
            }
        } catch {
            onToast("Could not change role.");
        }
    };

    const handleToggleActive = async (user: ManagedUser) => {
        try {
            await ensureCsrf();
            const res = await apiRequest(
                `/api/v1/administration/users/${user.id}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        is_active: !user.is_active,
                    }),
                },
            );
            if (res.ok) {
                onToast(
                    `${user.name} is now ${!user.is_active ? "Active" : "Inactive"}.`,
                );
                await loadData();
            }
        } catch {
            onToast("Could not update user status.");
        }
    };

    const handleCreateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName.trim()) {
            onToast("Role name is required.");
            return;
        }
        setSaving(true);
        try {
            await ensureCsrf();
            const res = await apiRequest("/api/v1/administration/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: roleName.trim(),
                    slug: roleSlug.trim() || undefined,
                    description: roleDesc.trim() || undefined,
                }),
            });
            if (res.ok) {
                setCreateRoleOpen(false);
                setRoleName("");
                setRoleSlug("");
                setRoleDesc("");
                onToast(`Created role: ${roleName}`);
                await loadData();
            }
        } finally {
            setSaving(false);
        }
    };

    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            !search.trim() ||
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.department.toLowerCase().includes(search.toLowerCase()) ||
            u.roles.some((r) =>
                r.name.toLowerCase().includes(search.toLowerCase()),
            );
        const matchesRole =
            roleFilter === "all" ||
            u.roles.some((r) => r.slug === roleFilter);
        return matchesSearch && matchesRole;
    });

    const superAdminCount = users.filter((u) =>
        u.roles.some((r) => r.slug === "super-administrator"),
    ).length;
    const adminCount = users.filter((u) =>
        u.roles.some((r) => r.slug === "administrator"),
    ).length;
    const dashRoleUsersCount = users.filter((u) =>
        u.roles.some((r) =>
            [
                "faculty",
                "visiting",
                "program",
                "hod",
                "dean",
                "academic",
                "management",
                "director",
            ].includes(r.slug),
        ),
    ).length;

    return (
        <div style={{ padding: 32, maxWidth: 1340, margin: "0 auto" }}>
            <PageHeader
                eyebrow="Super Administrator · Access & Governance"
                title="Users & Role-Based Login Management"
                sub="Create users, promote accounts to Super Admin or Administrator, and assign any of the 8 role dashboards (DASH-001 to DASH-008)."
                actions={
                    <>
                        <Button
                            variant="secondary"
                            size="md"
                            icon={
                                <Icon
                                    name="ShieldCheck"
                                    size={17}
                                    color="var(--indigo-700)"
                                />
                            }
                            onClick={() => setCreateRoleOpen(true)}
                        >
                            Create Role
                        </Button>
                        <Button
                            size="md"
                            icon={<Icon name="Plus" size={17} color="#fff" />}
                            onClick={openCreateUser}
                        >
                            Create User & Assign Role
                        </Button>
                    </>
                }
            />

            <KpiRow>
                <MetricCard
                    label="Total platform users"
                    value={users.length}
                    icon={
                        <Icon name="Users" size={18} color="var(--slate-400)" />
                    }
                />
                <MetricCard
                    label="Super Administrators"
                    value={superAdminCount}
                    icon={
                        <Icon
                            name="ShieldCheck"
                            size={18}
                            color="var(--slate-400)"
                        />
                    }
                />
                <MetricCard
                    label="Administrators"
                    value={adminCount}
                    icon={
                        <Icon name="User" size={18} color="var(--slate-400)" />
                    }
                />
                <MetricCard
                    label="Role-based dashboard users"
                    value={dashRoleUsersCount}
                    trend="up"
                    trendLabel="DASH-001 to DASH-008"
                    icon={
                        <Icon
                            name="LayoutDashboard"
                            size={18}
                            color="var(--slate-400)"
                        />
                    }
                />
            </KpiRow>

            {/* Filter & Search Bar */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    marginTop: 20,
                    marginBottom: 16,
                    padding: "12px 16px",
                    background: "#fff",
                    border: "1px solid var(--slate-200)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-sm)",
                }}
            >
                <div style={{ width: 320 }}>
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        icon={
                            <Icon
                                name="Search"
                                size={17}
                                color="var(--slate-400)"
                            />
                        }
                        placeholder="Search user name, email, department, role…"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{
                        height: 40,
                        padding: "0 12px",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--slate-300)",
                        fontFamily: "var(--font-sans)",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--slate-700)",
                        background: "#fff",
                        cursor: "pointer",
                    }}
                >
                    <option value="all">Filter by Role: All Roles</option>
                    {roles.map((r) => (
                        <option key={r.slug} value={r.slug}>
                            {r.name} ({r.slug})
                        </option>
                    ))}
                </select>
                <div
                    style={{
                        marginLeft: "auto",
                        fontSize: 12,
                        color: "var(--slate-500)",
                    }}
                >
                    Default password for seeded role accounts:{" "}
                    <strong style={{ color: "var(--indigo-700)" }}>
                        RahulSingh123!
                    </strong>
                </div>
            </div>

            {/* Users Table */}
            <ContentCard
                title={`Platform Users (${filteredUsers.length})`}
                padding="0"
            >
                {loading ? (
                    <div
                        style={{
                            padding: 32,
                            textAlign: "center",
                            fontSize: 14,
                            color: "var(--slate-500)",
                        }}
                    >
                        Loading users and roles…
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontFamily: "var(--font-sans)",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        background: "var(--slate-50)",
                                        borderBottom:
                                            "1px solid var(--slate-200)",
                                        textAlign: "left",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "var(--slate-500)",
                                        textTransform: "uppercase",
                                        letterSpacing: ".04em",
                                    }}
                                >
                                    <th style={{ padding: "12px 20px" }}>
                                        User & Email
                                    </th>
                                    <th style={{ padding: "12px 16px" }}>
                                        Department
                                    </th>
                                    <th style={{ padding: "12px 16px" }}>
                                        Current Role(s)
                                    </th>
                                    <th style={{ padding: "12px 16px" }}>
                                        Login Destination
                                    </th>
                                    <th style={{ padding: "12px 16px" }}>
                                        Quick Change Role
                                    </th>
                                    <th style={{ padding: "12px 16px" }}>
                                        Status
                                    </th>
                                    <th
                                        style={{
                                            padding: "12px 20px",
                                            textAlign: "right",
                                        }}
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((u, idx) => {
                                    const primarySlug =
                                        u.roles[0]?.slug ?? "faculty";
                                    const isSuper = u.roles.some(
                                        (r) => r.slug === "super-administrator",
                                    );
                                    const isAdmin = u.roles.some(
                                        (r) => r.slug === "administrator",
                                    );

                                    return (
                                        <tr
                                            key={u.id}
                                            style={{
                                                borderTop: idx
                                                    ? "1px solid var(--slate-100)"
                                                    : "none",
                                                background: "#fff",
                                            }}
                                        >
                                            <td style={{ padding: "14px 20px" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 12,
                                                    }}
                                                >
                                                    <Avatar
                                                        name={u.name}
                                                        size={36}
                                                    />
                                                    <div>
                                                        <div
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: 600,
                                                                color: "var(--slate-800)",
                                                            }}
                                                        >
                                                            {u.name}
                                                        </div>
                                                        <div
                                                            style={{
                                                                fontSize: 12,
                                                                color: "var(--slate-500)",
                                                            }}
                                                        >
                                                            {u.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "14px 16px",
                                                    fontSize: 13,
                                                    color: "var(--slate-600)",
                                                }}
                                            >
                                                {u.department}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        gap: 6,
                                                        flexWrap: "wrap",
                                                    }}
                                                >
                                                    {u.roles.map((r) => (
                                                        <Badge
                                                            key={r.slug}
                                                            tone={
                                                                r.slug ===
                                                                "super-administrator"
                                                                    ? "brand"
                                                                    : r.slug ===
                                                                        "administrator"
                                                                      ? "amber"
                                                                      : "green"
                                                            }
                                                        >
                                                            {r.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "14px 16px",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: isSuper
                                                        ? "var(--indigo-700)"
                                                        : isAdmin
                                                          ? "var(--amber-600)"
                                                          : "var(--slate-700)",
                                                }}
                                            >
                                                {DASHBOARD_SCREEN_MAP[
                                                    primarySlug
                                                ] ??
                                                    `Role Dashboard (${primarySlug})`}
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <select
                                                    value={primarySlug}
                                                    onChange={(e) =>
                                                        handleQuickRoleChange(
                                                            u,
                                                            e.target.value,
                                                        )
                                                    }
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-sans)",
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        color: "var(--indigo-700)",
                                                        border: "1px solid var(--slate-300)",
                                                        borderRadius:
                                                            "var(--radius-md)",
                                                        padding: "6px 10px",
                                                        background: "#fff",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {roles.map((r) => (
                                                        <option
                                                            key={r.slug}
                                                            value={r.slug}
                                                        >
                                                            {r.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td style={{ padding: "14px 16px" }}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleToggleActive(u)
                                                    }
                                                    style={{
                                                        border: "none",
                                                        background:
                                                            "transparent",
                                                        cursor: "pointer",
                                                        padding: 0,
                                                    }}
                                                >
                                                    <Badge
                                                        tone={
                                                            u.is_active
                                                                ? "green"
                                                                : "red"
                                                        }
                                                    >
                                                        {u.is_active
                                                            ? "Active"
                                                            : "Inactive"}
                                                    </Badge>
                                                </button>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "14px 20px",
                                                    textAlign: "right",
                                                }}
                                            >
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEditUser(u)
                                                    }
                                                >
                                                    Edit / Roles
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </ContentCard>

            {/* Roles Directory */}
            <ContentCard
                title={`Available Platform Roles (${roles.length})`}
                style={{ marginTop: 24 }}
                action={
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCreateRoleOpen(true)}
                    >
                        + Add Custom Role
                    </Button>
                }
            >
                <Grid cols="repeat(auto-fit, minmax(260px, 1fr))" gap={14}>
                    {roles.map((r) => (
                        <div
                            key={r.slug}
                            style={{
                                padding: 16,
                                border: "1px solid var(--slate-200)",
                                borderRadius: "var(--radius-md)",
                                background:
                                    r.slug === "super-administrator"
                                        ? "var(--indigo-50)"
                                        : "var(--slate-50)",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: 6,
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: "var(--slate-800)",
                                    }}
                                >
                                    {r.name}
                                </span>
                                <Badge tone="brand">
                                    {r.users_count ?? 0} users
                                </Badge>
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "var(--indigo-700)",
                                    marginBottom: 6,
                                }}
                            >
                                slug: {r.slug}
                            </div>
                            <div
                                style={{
                                    fontSize: 12,
                                    color: "var(--slate-600)",
                                    lineHeight: 1.45,
                                }}
                            >
                                {r.description || "Platform role"}
                            </div>
                        </div>
                    ))}
                </Grid>
            </ContentCard>

            {/* Create / Edit User Modal */}
            {(createUserOpen || editUser) && (
                <div
                    onClick={() => {
                        setCreateUserOpen(false);
                        setEditUser(null);
                    }}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 95,
                        background: "rgba(15, 23, 42, 0.48)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
                    <form
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={
                            editUser ? handleUpdateUser : handleCreateUser
                        }
                        style={{
                            width: "100%",
                            maxWidth: 560,
                            background: "#fff",
                            borderRadius: "var(--radius-lg)",
                            border: "1px solid var(--slate-200)",
                            boxShadow: "var(--shadow-xl)",
                            overflow: "hidden",
                            fontFamily: "var(--font-sans)",
                        }}
                    >
                        <div
                            style={{
                                padding: "18px 22px",
                                background: "var(--slate-50)",
                                borderBottom: "1px solid var(--slate-200)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <div
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "var(--indigo-700)",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Super Admin · Role Assignment
                                </div>
                                <div
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 700,
                                        color: "var(--slate-800)",
                                    }}
                                >
                                    {editUser
                                        ? `Edit User & Roles · ${editUser.name}`
                                        : "Create User & Assign Role"}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setCreateUserOpen(false);
                                    setEditUser(null);
                                }}
                                style={{
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                }}
                            >
                                <Icon
                                    name="X"
                                    size={18}
                                    color="var(--slate-500)"
                                />
                            </button>
                        </div>

                        <div
                            style={{
                                padding: 22,
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                                maxHeight: "75vh",
                                overflowY: "auto",
                            }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 12,
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "var(--slate-700)",
                                            marginBottom: 6,
                                        }}
                                    >
                                        Full Name
                                    </label>
                                    <Input
                                        value={formName}
                                        onChange={(e) =>
                                            setFormName(e.target.value)
                                        }
                                        placeholder="e.g., Dr. Vikram Sethi"
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "var(--slate-700)",
                                            marginBottom: 6,
                                        }}
                                    >
                                        Email Address
                                    </label>
                                    <Input
                                        type="email"
                                        value={formEmail}
                                        onChange={(e) =>
                                            setFormEmail(e.target.value)
                                        }
                                        placeholder="user@example.com"
                                    />
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 12,
                                }}
                            >
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "var(--slate-700)",
                                            marginBottom: 6,
                                        }}
                                    >
                                        {editUser
                                            ? "New Password (leave blank to keep)"
                                            : "Password"}
                                    </label>
                                    <Input
                                        type="text"
                                        value={formPassword}
                                        onChange={(e) =>
                                            setFormPassword(e.target.value)
                                        }
                                        placeholder={
                                            editUser
                                                ? "Leave blank to keep current"
                                                : "RahulSingh123!"
                                        }
                                    />
                                </div>
                                <div>
                                    <label
                                        style={{
                                            display: "block",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "var(--slate-700)",
                                            marginBottom: 6,
                                        }}
                                    >
                                        Department
                                    </label>
                                    <Input
                                        value={formDept}
                                        onChange={(e) =>
                                            setFormDept(e.target.value)
                                        }
                                        placeholder="e.g., CSE · Computer Science"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "var(--slate-700)",
                                        marginBottom: 8,
                                    }}
                                >
                                    Assign Role(s) (Super Admin, Admin, or any
                                    DASH-001..008 Role)
                                </label>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr",
                                        gap: 8,
                                        maxHeight: 220,
                                        overflowY: "auto",
                                        padding: 10,
                                        background: "var(--slate-50)",
                                        borderRadius: "var(--radius-md)",
                                        border: "1px solid var(--slate-200)",
                                    }}
                                >
                                    {roles.map((r) => {
                                        const checked = formRoles.includes(
                                            r.slug,
                                        );
                                        return (
                                            <label
                                                key={r.slug}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    padding: "7px 10px",
                                                    borderRadius: 8,
                                                    background: checked
                                                        ? "var(--indigo-50)"
                                                        : "#fff",
                                                    border:
                                                        "1px solid " +
                                                        (checked
                                                            ? "var(--indigo-700)"
                                                            : "var(--slate-200)"),
                                                    cursor: "pointer",
                                                    fontSize: 12,
                                                    fontWeight: checked
                                                        ? 600
                                                        : 500,
                                                    color: checked
                                                        ? "var(--indigo-700)"
                                                        : "var(--slate-700)",
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() =>
                                                        toggleFormRole(r.slug)
                                                    }
                                                />
                                                <span>{r.name}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <label
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 13,
                                    color: "var(--slate-700)",
                                    cursor: "pointer",
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={formActive}
                                    onChange={(e) =>
                                        setFormActive(e.target.checked)
                                    }
                                />
                                Account is Active (can sign in)
                            </label>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 10,
                                    marginTop: 6,
                                }}
                            >
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        setCreateUserOpen(false);
                                        setEditUser(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving
                                        ? "Saving…"
                                        : editUser
                                          ? "Save Changes"
                                          : "Create User"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Create Role Modal */}
            {createRoleOpen && (
                <div
                    onClick={() => setCreateRoleOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        zIndex: 95,
                        background: "rgba(15, 23, 42, 0.48)",
                        backdropFilter: "blur(2px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 20,
                    }}
                >
                    <form
                        onClick={(e) => e.stopPropagation()}
                        onSubmit={handleCreateRole}
                        style={{
                            width: "100%",
                            maxWidth: 460,
                            background: "#fff",
                            borderRadius: "var(--radius-lg)",
                            border: "1px solid var(--slate-200)",
                            boxShadow: "var(--shadow-xl)",
                            overflow: "hidden",
                            fontFamily: "var(--font-sans)",
                        }}
                    >
                        <div
                            style={{
                                padding: "18px 22px",
                                background: "var(--slate-50)",
                                borderBottom: "1px solid var(--slate-200)",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "var(--indigo-700)",
                                    textTransform: "uppercase",
                                }}
                            >
                                Super Admin · Role Builder
                            </div>
                            <div
                                style={{
                                    fontSize: 17,
                                    fontWeight: 700,
                                    color: "var(--slate-800)",
                                }}
                            >
                                Create New Platform Role
                            </div>
                        </div>
                        <div
                            style={{
                                padding: 22,
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                            }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "var(--slate-700)",
                                        marginBottom: 6,
                                    }}
                                >
                                    Role Name
                                </label>
                                <Input
                                    value={roleName}
                                    onChange={(e) =>
                                        setRoleName(e.target.value)
                                    }
                                    placeholder="e.g., Examination Controller"
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "var(--slate-700)",
                                        marginBottom: 6,
                                    }}
                                >
                                    Role Slug (optional)
                                </label>
                                <Input
                                    value={roleSlug}
                                    onChange={(e) =>
                                        setRoleSlug(e.target.value)
                                    }
                                    placeholder="e.g., exam-controller"
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        display: "block",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "var(--slate-700)",
                                        marginBottom: 6,
                                    }}
                                >
                                    Description
                                </label>
                                <Input
                                    value={roleDesc}
                                    onChange={(e) =>
                                        setRoleDesc(e.target.value)
                                    }
                                    placeholder="Describe what this role manages…"
                                />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 10,
                                    marginTop: 6,
                                }}
                            >
                                <Button
                                    variant="secondary"
                                    onClick={() => setCreateRoleOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? "Creating…" : "Create Role"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
