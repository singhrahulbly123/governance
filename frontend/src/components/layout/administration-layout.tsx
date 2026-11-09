import { AppHeader } from "@/components/layout/app-header";
import { AdministrationNavigation } from "@/components/layout/administration-navigation";
import { Container } from "@/components/ui/container";
import type { CurrentUser } from "@/types/auth";

export function AdministrationLayout({ children, currentPath, user }: { children: React.ReactNode; currentPath: string; user: CurrentUser }) {
    return <div className="min-h-screen bg-slate-50"><AppHeader user={user} /><Container className="grid gap-8 py-8 lg:grid-cols-[14rem_1fr]"><AdministrationNavigation currentPath={currentPath} user={user} /><main>{children}</main></Container></div>;
}
