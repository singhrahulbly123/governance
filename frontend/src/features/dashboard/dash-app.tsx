"use client";

import { useRouter } from "next/navigation";
import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
import {
    DashboardSecurityWorkspace,
    SessionWarnScreen,
} from "@/features/auth/auth-screens";
import { useCurrentUser } from "@/hooks/use-current-user";
import { signOut } from "@/services/api/auth";
import type { CurrentUser } from "@/types/auth";
import {
    type DashboardRoleId,
    ROLES,
} from "./dashboard-data";
import { LiveRoleDashboard } from "./live-role-dashboard";
import { LiveAdminMasterDataScreen } from "./live-admin-master-data-screen";
import {
    ActivityTimelineScreen,
    CalendarWorkspaceScreen,
    TasksWorkspaceScreen,
} from "./workspace-screens";
import { UsersRolesScreen } from "./users-roles-screen";
import {
    Avatar,
    Badge,
    Button,
    ContentCard,
    EmptyBlock,
    Icon,
    IconButton,
    Input,
    PageHeader,
    RAG_COLOR,
    SideNav,
    type SideNavItem,
    TopBar,
} from "./dashboard-primitives";
type DashboardNotification = {
    id: string;
    title: string;
    module: string;
    when: string;
    urgency: "high" | "normal";
    rag: "green" | "amber" | "red";
    read: boolean;
};

const IDLE_WARNING_MS = 14 * 60 * 1000;

export type DashRouteId =
    | "dashboard"
    | "notifications"
    | "calendar"
    | "tasks"
    | "approvals"
    | "activity"
    | "quickactions"
    | "health"
    | "users-roles"
    | "profile"
    | "change-password";

const DASH_ROUTE_IDS: readonly string[] = [
    "dashboard",
    "notifications",
    "calendar",
    "tasks",
    "approvals",
    "activity",
    "quickactions",
    "health",
    "users-roles",
    "profile",
    "change-password",
];

function isDashRouteId(value: string | null): value is DashRouteId {
    return value !== null && DASH_ROUTE_IDS.includes(value);
}

function getDashboardRoute(fallback: DashRouteId): DashRouteId {
    const requestedRoute = new URLSearchParams(window.location.search).get(
        "tab",
    );
    return isDashRouteId(requestedRoute) ? requestedRoute : fallback;
}

function subscribeToDashboardRoute(onChange: () => void) {
    window.addEventListener("popstate", onChange);
    window.addEventListener("dashboard-tab-change", onChange);
    return () => {
        window.removeEventListener("popstate", onChange);
        window.removeEventListener("dashboard-tab-change", onChange);
    };
}

const DASH_ROLE_SLUGS: DashboardRoleId[] = [
    "faculty",
    "visiting",
    "program",
    "hod",
    "dean",
    "academic",
    "management",
    "director",
];

function resolveUserDashboardRole(
    user?: CurrentUser | null,
    fallback: DashboardRoleId = "faculty",
): DashboardRoleId {
    if (!user) return fallback;
    for (const r of user.roles) {
        if (DASH_ROLE_SLUGS.includes(r.slug as DashboardRoleId)) {
            return r.slug as DashboardRoleId;
        }
    }
    return fallback;
}

function navFor(
    role: DashboardRoleId,
    hodApprovalsCount: number,
    deanApprovalsCount: number,
    isSuperAdmin: boolean,
    isStandardAdmin: boolean,
): SideNavItem[] {
    if (isStandardAdmin) {
        return [
            {
                id: "dashboard",
                label: "Administration",
                icon: <Icon name="LayoutDashboard" size={20} />,
            },
            { heading: "My workspace" },
            {
                id: "calendar",
                label: "My Calendar",
                icon: <Icon name="Calendar" size={20} />,
            },
            {
                id: "tasks",
                label: "My Tasks",
                icon: <Icon name="ListChecks" size={20} />,
            },
            {
                id: "activity",
                label: "Activity Timeline",
                icon: <Icon name="History" size={20} />,
            },
        ];
    }

    return [
        ...(isSuperAdmin
            ? [
                  { heading: "Super Admin" },
                  {
                      id: "users-roles",
                      label: "Users & Roles",
                      icon: <Icon name="Users" size={20} />,
                  },
              ]
            : []),
        {
            id: "dashboard",
            label: isSuperAdmin ? "Role Dashboards (8)" : "Dashboard",
            icon: <Icon name="LayoutDashboard" size={20} />,
        },
        { heading: "My workspace" },
        {
            id: "calendar",
            label: "My Calendar",
            icon: <Icon name="Calendar" size={20} />,
        },
        {
            id: "tasks",
            label: "My Tasks",
            icon: <Icon name="ListChecks" size={20} />,
        },
        ...(["hod", "dean"].includes(role)
            ? [
                  {
                      id: "approvals",
                      label: "My Approvals",
                      icon: <Icon name="CheckSquare" size={20} />,
                      badge:
                          role === "dean"
                              ? deanApprovalsCount
                              : hodApprovalsCount,
                  },
              ]
            : []),
        {
            id: "activity",
            label: "Activity Timeline",
            icon: <Icon name="History" size={20} />,
        },
        {
            id: "quickactions",
            label: "Quick Actions",
            icon: <Icon name="Zap" size={20} />,
        },
        ...(["dean", "academic", "management", "director"].includes(role)
            ? [
                  { heading: "Institution" },
                  {
                      id: "health",
                      label: "Institution Health",
                      icon: <Icon name="Activity" size={20} />,
                  },
              ]
            : []),
    ];
}

function NotifPanel({
    notifications,
    onClose,
    onOpen,
}: {
    notifications: DashboardNotification[];
    onClose: () => void;
    onOpen: (n: DashboardNotification) => void;
}) {
    const list = [...notifications].sort(
        (a, b) =>
            Number(a.read) - Number(b.read) || (a.urgency === "high" ? -1 : 1),
    );
    return (
        <div
            style={{
                position: "absolute",
                top: 52,
                right: 0,
                width: 380,
                background: "#fff",
                border: "1px solid var(--slate-200)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-xl)",
                zIndex: 50,
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    borderBottom: "1px solid var(--slate-200)",
                }}
            >
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "var(--slate-800)",
                    }}
                >
                    Notifications
                </span>
                <Badge tone="red">
                    {list.filter((n) => !n.read).length} unread
                </Badge>
            </div>
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
                {list.map((n, i) => (
                    <div
                        key={n.id}
                        onClick={() => onOpen(n)}
                        style={{
                            display: "flex",
                            gap: 12,
                            padding: "13px 16px",
                            borderTop: i ? "1px solid var(--slate-100)" : "none",
                            cursor: "pointer",
                            background: n.read
                                ? "#fff"
                                : n.urgency === "high"
                                  ? "var(--red-fill)"
                                  : "var(--slate-50)",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.filter = "brightness(0.98)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.filter = "none";
                        }}
                    >
                        <span
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                marginTop: 6,
                                flex: "none",
                                background: RAG_COLOR[n.rag],
                            }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 3,
                                }}
                            >
                                {n.urgency === "high" && (
                                    <Badge tone="red">High</Badge>
                                )}
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        color: "var(--slate-400)",
                                        textTransform: "uppercase",
                                        letterSpacing: ".03em",
                                    }}
                                >
                                    {n.module}
                                </span>
                            </div>
                            <div
                                style={{
                                    fontSize: 13,
                                    color: "var(--slate-800)",
                                    lineHeight: 1.45,
                                    fontWeight: n.read ? 400 : 600,
                                }}
                            >
                                {n.title}
                            </div>
                            <div
                                style={{
                                    fontSize: 11,
                                    color: "var(--slate-400)",
                                    marginTop: 4,
                                }}
                            >
                                {n.when}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div
                style={{
                    padding: 10,
                    borderTop: "1px solid var(--slate-200)",
                    textAlign: "center",
                }}
            >
                <Button variant="ghost" size="sm" onClick={onClose}>
                    View all in Notifications Center
                </Button>
            </div>
        </div>
    );
}

function Toaster({ msg }: { msg: string }) {
    if (!msg) return null;
    return (
        <div
            style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--slate-800)",
                color: "#fff",
                padding: "12px 18px",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-xl)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                maxWidth: 420,
            }}
        >
            <Icon name="ArrowRightCircle" size={18} color="#fff" />
            <span>{msg}</span>
        </div>
    );
}

function UtilityStub({ label }: { label: string }) {
    return (
        <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
            <PageHeader
                eyebrow="Live institutional data"
                title={label}
                sub="This section only displays records stored by the connected backend."
            />
            <ContentCard>
                <EmptyBlock
                    icon="Hammer"
                    title={`${label} has no records yet`}
                    desc="No live records are available for this section. It will populate when its backend module and database records are configured."
                />
            </ContentCard>
        </div>
    );
}

export function DashApp({
    initialRole = "faculty",
    initialRoute = "dashboard",
    authUser: propAuthUser,
}: {
    initialRole?: DashboardRoleId;
    initialRoute?: DashRouteId;
    authUser?: CurrentUser | null;
}) {
    const { user: fetchedUser, loading: userLoading } = useCurrentUser();
    const authUser = propAuthUser ?? fetchedUser;
    const assignedRole = resolveUserDashboardRole(authUser, initialRole);
    const [roleOverride, setRoleOverride] = useState<DashboardRoleId | null>(
        null,
    );
    const isSuperAdmin = Boolean(
        authUser?.roles.some((r) => r.slug === "super-administrator"),
    );
    const isStandardAdmin = Boolean(
        authUser &&
            !isSuperAdmin &&
            authUser.roles.some((r) => r.slug === "administrator") &&
            !authUser.roles.some((r) =>
                DASH_ROLE_SLUGS.includes(r.slug as DashboardRoleId),
            ),
    );
    const role = isSuperAdmin
        ? (roleOverride ?? assignedRole)
        : assignedRole;
    const setRole = (next: DashboardRoleId) => setRoleOverride(next);
    const route = useSyncExternalStore(
        subscribeToDashboardRoute,
        () => getDashboardRoute(initialRoute),
        () => initialRoute,
    );
    const [toast, setToast] = useState("");
    const toastTimerRef = useRef<number | null>(null);

    const setRoute = useCallback((nextRoute: DashRouteId) => {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", nextRoute);
        window.history.replaceState(window.history.state, "", url);
        window.dispatchEvent(new Event("dashboard-tab-change"));
    }, []);
    const flash = useCallback((m: string) => {
        setToast(m);
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = window.setTimeout(() => setToast(""), 2600);
    }, []);

    if (userLoading && !authUser) {
        return (
            <main
                style={{
                    minHeight: "100vh",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    color: "var(--slate-500)",
                    background: "var(--slate-100)",
                }}
            >
                Loading your workspace…
            </main>
        );
    }

    return (
        <DashAppInner
            role={role}
            setRole={setRole}
            route={route}
            setRoute={setRoute}
            toast={toast}
            authUser={authUser}
            isSuperAdmin={isSuperAdmin}
            isStandardAdmin={isStandardAdmin}
            onToast={flash}
        />
    );
}

function DashAppInner({
    role,
    setRole,
    route,
    setRoute,
    toast,
    authUser,
    isSuperAdmin,
    isStandardAdmin,
    onToast,
}: {
    role: DashboardRoleId;
    setRole: (r: DashboardRoleId) => void;
    route: DashRouteId;
    setRoute: (r: DashRouteId) => void;
    toast: string;
    authUser?: CurrentUser | null;
    isSuperAdmin: boolean;
    isStandardAdmin: boolean;
    onToast: (msg: string) => void;
}) {
    const router = useRouter();

    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showIdleWarning, setShowIdleWarning] = useState(false);

    const roleMeta = ROLES.find((r) => r.id === role) ?? ROLES[0];
    const displayName = authUser?.name || roleMeta.label;
    const displayRole = authUser?.roles[0]?.name || roleMeta.label;
    const unread = 0;

    useEffect(() => {
        if (showIdleWarning) return;
        let timer = window.setTimeout(() => {
            setShowIdleWarning(true);
        }, IDLE_WARNING_MS);

        const resetIdleTimer = () => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                setShowIdleWarning(true);
            }, IDLE_WARNING_MS);
        };

        const events = [
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
        ] as const;
        events.forEach((ev) =>
            window.addEventListener(ev, resetIdleTimer, { passive: true }),
        );
        return () => {
            window.clearTimeout(timer);
            events.forEach((ev) =>
                window.removeEventListener(ev, resetIdleTimer),
            );
        };
    }, [showIdleWarning]);

    const switchRole = (id: DashboardRoleId) => {
        setRole(id);
        setRoute("dashboard");
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch {
            // Redirect even if session expired
        }
        router.replace("/login");
    };

    const searchMatches = searchQuery.trim() && isSuperAdmin
        ? ROLES.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => ({
                  id: `role-${item.id}`,
                  title: item.label,
                  sub: "Open role dashboard",
                  run: () => switchRole(item.id),
              }))
        : [];

    const renderRoleDashboard = () => {
        return <LiveRoleDashboard role={role} />;
    };

    const renderContent = () => {
        if (route !== "dashboard") {
            switch (route) {
                case "notifications":
                    return <UtilityStub label="Notifications" />;
                case "calendar":
                    return <CalendarWorkspaceScreen />;
                case "tasks":
                    return <TasksWorkspaceScreen />;
                case "approvals":
                    return <UtilityStub label="Approvals" />;
                case "activity":
                    return <ActivityTimelineScreen />;
                case "quickactions":
                    return <UtilityStub label="Quick actions" />;
                case "health":
                    return <UtilityStub label="Institution health" />;
                case "users-roles":
                    return isSuperAdmin ? (
                        <UsersRolesScreen onToast={onToast} />
                    ) : (
                        renderRoleDashboard()
                    );
                case "profile":
                    return (
                        <div
                            style={{
                                padding: "28px 32px 48px",
                                maxWidth: 1180,
                                margin: "0 auto",
                            }}
                        >
                            <DashboardSecurityWorkspace
                                section="profile"
                                initialScreen="profile"
                            />
                        </div>
                    );
                case "change-password":
                    return (
                        <div
                            style={{
                                padding: "28px 32px 48px",
                                maxWidth: 1180,
                                margin: "0 auto",
                            }}
                        >
                            <DashboardSecurityWorkspace
                                section="change-password"
                                initialScreen="change"
                            />
                        </div>
                    );
                default:
                    return <UtilityStub label="Screen" />;
            }
        }
        if (isStandardAdmin) {
            return (
                <LiveAdminMasterDataScreen
                    userName={authUser?.name}
                />
            );
        }
        return renderRoleDashboard();
    };

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                fontFamily: "var(--font-sans)",
                background: "var(--slate-100)",
            }}
        >
            <TopBar
                brand={
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setRoute("dashboard")}
                            title="Back to Dashboard"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: "var(--slate-100)",
                                border: "none",
                                cursor: "pointer",
                                flex: "none",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                    "var(--slate-200)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                    "var(--slate-100)";
                            }}
                        >
                            <Icon
                                name="ArrowLeft"
                                size={17}
                                color="var(--slate-600)"
                            />
                        </button>
                        <span
                            style={{
                                width: 30,
                                height: 30,
                                borderRadius: 8,
                                background: "var(--indigo-700)",
                                color: "#fff",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 15,
                            }}
                        >
                            ERP
                        </span>
                        <span
                            style={{
                                fontSize: 17,
                                fontWeight: 700,
                                color: "var(--indigo-700)",
                                letterSpacing: "-0.4px",
                            }}
                        >
                            ERP
                        </span>
                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "var(--slate-400)",
                                padding: "3px 8px",
                                background: "var(--slate-100)",
                                borderRadius: "var(--radius-pill)",
                            }}
                        >
                            Dashboard
                        </span>
                    </div>
                }
                search={
                    <div style={{ position: "relative" }}>
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={
                                <Icon
                                    name="Search"
                                    size={18}
                                    color="var(--slate-400)"
                                />
                            }
                            placeholder="Search faculty, KRAs, records…"
                        />
                        {searchMatches.length > 0 && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 44,
                                    left: 0,
                                    right: 0,
                                    background: "#fff",
                                    border: "1px solid var(--slate-200)",
                                    borderRadius: "var(--radius-md)",
                                    boxShadow: "var(--shadow-xl)",
                                    zIndex: 60,
                                    overflow: "hidden",
                                }}
                            >
                                {searchMatches.map((m, i) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => {
                                            m.run();
                                            setSearchQuery("");
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "10px 14px",
                                            border: "none",
                                            borderTop: i
                                                ? "1px solid var(--slate-100)"
                                                : "none",
                                            background: "#fff",
                                            textAlign: "left",
                                            cursor: "pointer",
                                            fontFamily: "var(--font-sans)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: "var(--slate-800)",
                                            }}
                                        >
                                            {m.title}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: "var(--slate-500)",
                                            }}
                                        >
                                            {m.sub}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                }
                actions={
                    <>
                        {isSuperAdmin ? (
                            <>
                                <Button
                                    variant={
                                        route === "users-roles"
                                            ? "primary"
                                            : "secondary"
                                    }
                                    size="sm"
                                    icon={
                                        <Icon
                                            name="Users"
                                            size={15}
                                            color={
                                                route === "users-roles"
                                                    ? "#fff"
                                                    : "var(--indigo-700)"
                                            }
                                        />
                                    }
                                    onClick={() => setRoute("users-roles")}
                                >
                                    Users & Roles
                                </Button>
                                <label
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        marginRight: 4,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 600,
                                            color: "var(--slate-400)",
                                            textTransform: "uppercase",
                                            letterSpacing: ".03em",
                                        }}
                                    >
                                        Viewing as
                                    </span>
                                    <select
                                        value={role}
                                        onChange={(e) =>
                                            switchRole(
                                                e.target
                                                    .value as DashboardRoleId,
                                            )
                                        }
                                        style={{
                                            fontFamily: "var(--font-sans)",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "var(--indigo-700)",
                                            border: "1px solid var(--slate-300)",
                                            borderRadius: "var(--radius-md)",
                                            padding: "7px 10px",
                                            background: "#fff",
                                            cursor: "pointer",
                                        }}
                                    >
                                        {ROLES.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.code} · {r.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </>
                        ) : isStandardAdmin ? (
                            <Badge tone="amber">
                                Administrator · Master Data
                            </Badge>
                        ) : (
                            <Badge tone="brand">
                                {roleMeta.code} · {roleMeta.label}
                            </Badge>
                        )}
                        <div style={{ position: "relative" }}>
                            <IconButton
                                icon={
                                    <Icon
                                        name="Bell"
                                        size={20}
                                        color="var(--slate-600)"
                                    />
                                }
                                label="Notifications"
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    setNotifOpen((o) => !o);
                                }}
                            />
                            {unread > 0 && (
                                <span
                                    style={{
                                        position: "absolute",
                                        top: 2,
                                        right: 2,
                                        minWidth: 16,
                                        height: 16,
                                        padding: "0 4px",
                                        borderRadius: 999,
                                        background: "var(--red-600)",
                                        color: "#fff",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        pointerEvents: "none",
                                    }}
                                >
                                    {unread}
                                </span>
                            )}
                            {notifOpen && (
                                <NotifPanel
                                    notifications={[]}
                                    onClose={() => {
                                        setNotifOpen(false);
                                        setRoute("notifications");
                                    }}
                                    onOpen={() => {
                                        setNotifOpen(false);
                                        setRoute("notifications");
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ position: "relative" }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setNotifOpen(false);
                                    setUserMenuOpen((o) => !o);
                                }}
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 10,
                                    paddingLeft: 8,
                                    borderLeft: "1px solid var(--slate-200)",
                                    marginLeft: 4,
                                    background: "transparent",
                                    borderTop: "none",
                                    borderRight: "none",
                                    borderBottom: "none",
                                    cursor: "pointer",
                                    fontFamily: "var(--font-sans)",
                                }}
                            >
                                <div
                                    style={{
                                        textAlign: "right",
                                        lineHeight: 1.25,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "var(--slate-800)",
                                        }}
                                    >
                                        {displayName}
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 11,
                                            color: "var(--slate-500)",
                                        }}
                                    >
                                        {displayRole}
                                    </div>
                                </div>
                                <Avatar name={displayName} size={34} />
                            </button>
                            {userMenuOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 52,
                                        right: 0,
                                        width: 240,
                                        background: "#fff",
                                        border: "1px solid var(--slate-200)",
                                        borderRadius: "var(--radius-lg)",
                                        boxShadow: "var(--shadow-xl)",
                                        zIndex: 50,
                                        padding: 6,
                                    }}
                                >
                                    {authUser && (
                                        <div
                                            style={{
                                                padding: "8px 12px",
                                                borderBottom:
                                                    "1px solid var(--slate-100)",
                                                marginBottom: 4,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    color: "var(--slate-400)",
                                                    textTransform: "uppercase",
                                                }}
                                            >
                                                Signed in account
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    color: "var(--slate-700)",
                                                    marginTop: 2,
                                                }}
                                            >
                                                {authUser.email}
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            setRoute("profile");
                                        }}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "9px 12px",
                                            border: "none",
                                            borderRadius: "var(--radius-md)",
                                            background: "transparent",
                                            color: "var(--slate-700)",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            fontFamily: "var(--font-sans)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <Icon
                                            name="User"
                                            size={16}
                                            color="var(--slate-500)"
                                        />
                                        My Profile
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setUserMenuOpen(false);
                                            setRoute("change-password");
                                        }}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "9px 12px",
                                            border: "none",
                                            borderRadius: "var(--radius-md)",
                                            background: "transparent",
                                            color: "var(--slate-700)",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            fontFamily: "var(--font-sans)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <Icon
                                            name="ShieldCheck"
                                            size={16}
                                            color="var(--slate-500)"
                                        />
                                        Change Password
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            padding: "9px 12px",
                                            border: "none",
                                            borderRadius: "var(--radius-md)",
                                            background: "transparent",
                                            color: "var(--red-600)",
                                            fontSize: 13,
                                            fontWeight: 600,
                                            fontFamily: "var(--font-sans)",
                                            cursor: "pointer",
                                            textAlign: "left",
                                        }}
                                    >
                                        <Icon
                                            name="ArrowLeft"
                                            size={16}
                                            color="var(--red-600)"
                                        />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                }
            />
            <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
                <SideNav
                    activeId={route}
                    onSelect={(id) => setRoute(id as DashRouteId)}
                    items={navFor(
                        role,
                        0,
                        0,
                        isSuperAdmin,
                        isStandardAdmin,
                    )}
                    footer={
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "4px 8px",
                                    fontSize: 12,
                                    color: "var(--slate-500)",
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 8,
                                    }}
                                >
                                    <Icon
                                        name="HelpCircle"
                                        size={18}
                                        color="var(--slate-500)"
                                    />{" "}
                                    Help & docs
                                </span>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    style={{
                                        border: "none",
                                        background: "transparent",
                                        color: "var(--slate-500)",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        fontFamily: "var(--font-sans)",
                                    }}
                                >
                                    Sign out
                                </button>
                            </div>
                        </div>
                    }
                />
                <main
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        minWidth: 0,
                        background: "var(--slate-100)",
                    }}
                    onClick={() => {
                        if (notifOpen) setNotifOpen(false);
                        if (userMenuOpen) setUserMenuOpen(false);
                    }}
                >
                    {renderContent()}
                </main>
            </div>
            <Toaster msg={toast} />
            {showIdleWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs">
                    <SessionWarnScreen
                        go={() => {
                            window.location.replace("/session-expired?ended=1");
                        }}
                        onStaySignedIn={() => setShowIdleWarning(false)}
                    />
                </div>
            )}
        </div>
    );
}
