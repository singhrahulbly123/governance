import { Card } from "@/components/ui/card";

export function DashboardCard({ description, title }: { description: string; title: string }) {
    return <Card><h2 className="font-semibold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></Card>;
}
