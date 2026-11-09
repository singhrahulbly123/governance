import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
    return <article className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`} {...props} />;
}
