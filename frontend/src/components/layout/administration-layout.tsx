import { AppHeader } from "@/components/layout/app-header";
import { AdministrationNavigation } from "@/components/layout/administration-navigation";
import type { CurrentUser } from "@/types/auth";

export function AdministrationLayout({ children, currentPath, user }: { children: React.ReactNode; currentPath: string; user: CurrentUser }) {
    return <div className="min-h-screen bg-slate-100 lg:pl-64"><AdministrationNavigation currentPath={currentPath} user={user} /><div className="min-h-screen"><AppHeader user={user} /><main className="mx-auto max-w-7xl p-5 sm:p-8">{children}</main></div></div>;
}
