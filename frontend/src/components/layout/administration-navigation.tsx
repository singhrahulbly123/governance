import Link from "next/link";
import type { AdministrationRole, CurrentUser } from "@/types/auth";

const links: { href: string; label: string; role: AdministrationRole }[] = [
    { href: "/admin", label: "Administrator", role: "administrator" },
    { href: "/super-admin", label: "Super administrator", role: "super-administrator" },
];

export function AdministrationNavigation({ currentPath, user }: { currentPath: string; user: CurrentUser }) {
    const isSuperAdministrator = user.roles.some((role) => role.slug === "super-administrator");

    return <nav aria-label="Administration navigation" className="flex gap-2 overflow-x-auto lg:flex-col">{links.filter((link) => link.role === "administrator" || isSuperAdministrator).map((link) => <Link key={link.href} href={link.href} className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${currentPath === link.href ? "bg-indigo-700 text-white" : "text-slate-700 hover:bg-slate-200"}`}>{link.label}</Link>)}</nav>;
}
