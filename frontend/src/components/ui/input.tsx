import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string };

export function Input({ id, label, className = "", ...props }: InputProps) {
    return <label className="block text-sm font-medium text-slate-800" htmlFor={id}>{label}<input id={id} className={`mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-700 focus:ring-2 focus:ring-indigo-100 ${className}`} {...props} /></label>;
}
