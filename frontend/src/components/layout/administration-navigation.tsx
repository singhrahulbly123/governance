import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { AdministrationRole, CurrentUser } from "@/types/auth";

const links: { href: string; label: string; icon: "books" | "dashboard" | "people" | "shield"; role: AdministrationRole | "all" }[] = [
    { href: "/admin", label: "Overview", icon: "dashboard", role: "all" },
    { href: "/admin", label: "Academic workspace", icon: "books", role: "administrator" },
    { href: "/super-admin", label: "Platform overview", icon: "shield", role: "super-administrator" },
    { href: "/super-admin", label: "Administrators", icon: "people", role: "super-administrator" },
];

export function AdministrationNavigation({ currentPath, user }: { currentPath: string; user: CurrentUser }) {
    const isSuperAdministrator = user.roles.some((role) => role.slug === "super-administrator");

    const visibleLinks = links.filter((link) => link.role === "all" || link.role === "administrator" && !isSuperAdministrator || link.role === "super-administrator" && isSuperAdministrator);

    return <aside className="flex w-full shrink-0 flex-col bg-slate-950 text-slate-300 lg:fixed lg:inset-y-0 lg:left-0 lg:w-64"><div className="flex items-center gap-3 border-b border-white/10 px-6 py-6"><span className="grid size-9 place-items-center rounded-xl bg-indigo-500 text-sm font-bold text-white">DT</span><div><p className="font-semibold text-white">DIA Thrive</p><p className="text-xs text-slate-400">Governance workspace</p></div></div><nav aria-label="Administration navigation" className="flex flex-1 gap-1 overflow-x-auto px-3 py-5 lg:flex-col">{visibleLinks.map((link) => <Link key={`${link.href}-${link.label}`} href={link.href} className={`flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${currentPath === link.href && (link.role === "all" || link.role === "super-administrator" && isSuperAdministrator) ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30" : "hover:bg-white/10 hover:text-white"}`}><Icon name={link.icon} />{link.label}</Link>)}</nav><div className="m-3 rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Signed in as</p><p className="mt-2 text-sm font-semibold text-white">{isSuperAdministrator ? "Super Administrator" : "Administrator"}</p><p className="mt-1 truncate text-xs text-slate-400">{user.email}</p></div></aside>;
}
