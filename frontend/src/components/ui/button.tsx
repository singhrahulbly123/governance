import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
    const variants = {
        primary: "bg-indigo-700 text-white hover:bg-indigo-800 focus-visible:outline-indigo-700",
        secondary: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 focus-visible:outline-slate-500",
    };

    return <button className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} {...props} />;
}
