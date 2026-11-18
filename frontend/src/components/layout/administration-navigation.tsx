import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { AdministrationRole, CurrentUser } from "@/types/auth";

type NavItem = {
    href: string;
    label: string;
    icon: "books" | "calendar" | "dashboard" | "departments" | "people" | "programs" | "settings" | "shield";
    role: AdministrationRole | "both";
    matchExact?: boolean;
};

const workspaceLinks: NavItem[] = [
    { href: "/admin", label: "Overview", icon: "dashboard", role: "administrator", matchExact: true },
    { href: "/admin", label: "Academic workspace", icon: "books", role: "administrator" },
    { href: "/super-admin", label: "Overview", icon: "dashboard", role: "super-administrator", matchExact: true },
    { href: "/super-admin", label: "Platform overview", icon: "shield", role: "super-administrator" },
    { href: "/super-admin", label: "Administrators", icon: "people", role: "super-administrator" },
];

const accountLinks: NavItem[] = [
    { href: "/security/profile", label: "My Profile", icon: "people", role: "both" },
    { href: "/security/change-password", label: "Change Password", icon: "settings", role: "both" },
];

export function AdministrationNavigation({ currentPath, user }: { currentPath: string; user: CurrentUser }) {
    const isSuperAdministrator = user.roles.some((role) => role.slug === "super-administrator");
    const activeRole: AdministrationRole = isSuperAdministrator ? "super-administrator" : "administrator";
    const visibleWorkspaceLinks = workspaceLinks.filter((link) => link.role === activeRole);

    return (
        <aside className="flex w-full shrink-0 flex-col bg-slate-950 text-slate-300 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64">
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
                <span className="grid size-9 place-items-center rounded-xl bg-indigo-500 text-[10px] font-bold text-white">
                    ERP
                </span>
                <div>
                    <p className="font-semibold text-white">ERP</p>
                    <p className="text-xs text-slate-400">Governance workspace</p>
                </div>
            </div>

            <nav aria-label="Administration navigation" className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-5">
                <div>
                    <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        Workspace
                    </p>
                    <div className="flex gap-1 overflow-x-auto lg:flex-col">
                        {visibleWorkspaceLinks.map((link) => {
                            const active = currentPath === link.href && !!link.matchExact;
                            return (
                                <Link
                                    key={`${link.href}-${link.label}`}
                                    href={link.href}
                                    className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        active
                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                                            : "hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Icon name={link.icon} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">
                        Account Settings
                    </p>
                    <div className="flex gap-1 overflow-x-auto lg:flex-col">
                        {accountLinks.map((link) => {
                            const active =
                                currentPath === link.href ||
                                (link.href === "/security/profile" && currentPath === "/security") ||
                                (link.href === "/security/change-password" && currentPath === "/change-password");
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                                        active
                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                                            : "hover:bg-white/10 hover:text-white"
                                    }`}
                                >
                                    <Icon name={link.icon} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            <div className="m-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
                    Signed in as
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                    {isSuperAdministrator ? "Super Administrator" : "Administrator"}
                </p>
                <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
            </div>
        </aside>
    );
}
