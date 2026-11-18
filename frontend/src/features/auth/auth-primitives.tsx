"use client";

import React, { useEffect, useRef, useState } from "react";

export type AuthIconName =
    | "AlertCircle"
    | "AlertTriangle"
    | "ArrowLeft"
    | "ArrowRight"
    | "BadgeCheck"
    | "Building2"
    | "Check"
    | "CheckCircle2"
    | "Circle"
    | "ClipboardCheck"
    | "Clock"
    | "Eye"
    | "EyeOff"
    | "Info"
    | "KeyRound"
    | "LayoutDashboard"
    | "Lock"
    | "LogIn"
    | "Mail"
    | "MailCheck"
    | "Monitor"
    | "Phone"
    | "RotateCcw"
    | "ShieldAlert"
    | "ShieldCheck"
    | "Smartphone"
    | "Sparkles"
    | "Upload";

export function AuthIcon({
    name,
    size = 18,
    className = "",
}: {
    name: AuthIconName;
    size?: number;
    className?: string;
}) {
    const props = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.75,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        className: `shrink-0 ${className}`,
        "aria-hidden": true,
    };

    switch (name) {
        case "Building2":
            return <svg {...props}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>;
        case "Mail":
            return <svg {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
        case "MailCheck":
            return <svg {...props}><path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /><path d="m16 19 2 2 4-4" /></svg>;
        case "KeyRound":
            return <svg {...props}><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg>;
        case "ArrowLeft":
            return <svg {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>;
        case "ArrowRight":
            return <svg {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>;
        case "ShieldCheck":
            return <svg {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>;
        case "ShieldAlert":
            return <svg {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>;
        case "Lock":
            return <svg {...props}><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
        case "Eye":
            return <svg {...props}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>;
        case "EyeOff":
            return <svg {...props}><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></svg>;
        case "CheckCircle2":
            return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>;
        case "Circle":
            return <svg {...props}><circle cx="12" cy="12" r="10" /></svg>;
        case "AlertTriangle":
            return <svg {...props}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
        case "AlertCircle":
            return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>;
        case "Info":
            return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>;
        case "Clock":
            return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
        case "LogIn":
            return <svg {...props}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>;
        case "LayoutDashboard":
            return <svg {...props}><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>;
        case "Upload":
            return <svg {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>;
        case "Phone":
            return <svg {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
        case "BadgeCheck":
            return <svg {...props}><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="m9 12 2 2 4-4" /></svg>;
        case "Check":
            return <svg {...props}><path d="M20 6 9 17l-5-5" /></svg>;
        case "RotateCcw":
            return <svg {...props}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>;
        case "ClipboardCheck":
            return <svg {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="m9 14 2 2 4-4" /></svg>;
        case "Sparkles":
            return <svg {...props}><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></svg>;
        case "Smartphone":
            return <svg {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>;
        case "Monitor":
            return <svg {...props}><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>;
    }
}

export function AuthSpinner({ size = 16 }: { size?: number }) {
    return (
        <span
            style={{ width: size, height: size }}
            className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
        />
    );
}

export function Brand({ sub }: { sub?: string }) {
    return (
        <div className="mb-7 text-center">
            <div className="inline-flex items-center gap-2.5">
                <span className="inline-flex size-[38px] items-center justify-center rounded-[11px] bg-indigo-700 text-[11px] font-bold tracking-tight text-white">
                    ERP
                </span>
                <span className="text-[25px] font-bold tracking-tight text-indigo-700">
                    ERP
                </span>
            </div>
            {sub && <div className="mt-2.5 text-[13px] text-slate-500">{sub}</div>}
        </div>
    );
}

export function AuthCardWrap({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
            {children}
        </div>
    );
}

export function AuthCard({
    title,
    desc,
    children,
    footer,
    width = 428,
    icon,
    iconTone = "brand",
}: {
    title?: React.ReactNode;
    desc?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: number;
    icon?: AuthIconName;
    iconTone?: "brand" | "red" | "amber" | "green" | "slate";
}) {
    const tones = {
        brand: "bg-indigo-50 text-indigo-700",
        red: "bg-red-100 text-red-600",
        amber: "bg-amber-100 text-amber-600",
        green: "bg-green-100 text-green-600",
        slate: "bg-slate-100 text-slate-500",
    }[iconTone];

    return (
        <div style={{ width, maxWidth: "100%" }}>
            <div className="rounded-xl border border-slate-200 bg-white p-7 shadow-md">
                {icon && (
                    <div className={`mb-4.5 flex size-[52px] items-center justify-center rounded-full ${tones}`}>
                        <AuthIcon name={icon} size={26} />
                    </div>
                )}
                {title && (
                    <h1 className="text-[19px] font-semibold tracking-tight text-slate-800">
                        {title}
                    </h1>
                )}
                {desc && (
                    <div className="mt-1.5 text-[14px] leading-[1.55] text-slate-500">
                        {desc}
                    </div>
                )}
                <div className="mt-5.5">{children}</div>
            </div>
            {footer && (
                <div className="mt-4.5 text-center text-[13px] text-slate-500">
                    {footer}
                </div>
            )}
        </div>
    );
}

export function Divider({ label }: { label?: string }) {
    return (
        <div className="my-1 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            {label && (
                <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                    {label}
                </span>
            )}
            <div className="h-px flex-1 bg-slate-200" />
        </div>
    );
}

export function Banner({
    tone = "info",
    title,
    children,
    className = "",
}: {
    tone?: "info" | "green" | "amber" | "red";
    title?: string;
    children: React.ReactNode;
    className?: string;
}) {
    const map: Record<
        "info" | "green" | "amber" | "red",
        { box: string; iconColor: string; icon: AuthIconName }
    > = {
        info: {
            box: "bg-indigo-50 border-indigo-300",
            iconColor: "text-indigo-700",
            icon: "Info",
        },
        green: {
            box: "bg-[#DCFCE7] border-[#16A34A]",
            iconColor: "text-[#16A34A]",
            icon: "CheckCircle2",
        },
        amber: {
            box: "bg-[#FEF3C7] border-[#D97706]",
            iconColor: "text-[#B45309]",
            icon: "AlertTriangle",
        },
        red: {
            box: "bg-[#FEE2E2] border-[#DC2626]",
            iconColor: "text-[#DC2626]",
            icon: "AlertCircle",
        },
    };

    const current = map[tone];

    return (
        <div className={`flex gap-2.5 rounded-lg border px-3.5 py-3 ${current.box} ${className}`}>
            <span className={`mt-0.5 shrink-0 ${current.iconColor}`}>
                <AuthIcon name={current.icon} size={18} />
            </span>
            <div className="text-[13px] leading-relaxed text-slate-700">
                {title && (
                    <div className="mb-0.5 font-semibold text-slate-800">{title}</div>
                )}
                {children}
            </div>
        </div>
    );
}

export function AuthButton({
    variant = "primary",
    size = "md",
    icon,
    iconRight,
    loading = false,
    disabled = false,
    type = "button",
    className = "",
    children,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    loading?: boolean;
}) {
    const isDisabled = disabled || loading;

    const sizes = {
        sm: "h-8 px-3 text-[14px] gap-1.5",
        md: "h-10 px-4 text-[14px] gap-2",
        lg: "min-h-12 px-5 py-2.5 text-[16px] gap-2",
    }[size];

    const variants = isDisabled
        ? "bg-slate-200 text-slate-400 border border-transparent cursor-not-allowed"
        : {
              primary:
                  "bg-indigo-700 text-white border border-transparent hover:brightness-95 active:brightness-90 cursor-pointer",
              secondary:
                  "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 active:bg-slate-100 cursor-pointer",
              ghost:
                  "bg-transparent text-indigo-700 border border-transparent hover:bg-indigo-50 active:bg-indigo-100 cursor-pointer",
              danger:
                  "bg-red-600 text-white border border-transparent hover:brightness-95 active:brightness-90 cursor-pointer",
          }[variant];

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={`inline-flex items-center justify-center rounded-lg font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 ${sizes} ${variants} ${className}`}
            {...rest}
        >
            {loading ? (
                <>
                    <AuthSpinner size={16} />
                    {children && <span>{children}</span>}
                </>
            ) : (
                <>
                    {icon && <span className="inline-flex">{icon}</span>}
                    {children}
                    {iconRight && <span className="inline-flex">{iconRight}</span>}
                </>
            )}
        </button>
    );
}

export function AuthFormField({
    label,
    htmlFor,
    required = false,
    hint,
    error,
    children,
}: {
    label?: string;
    htmlFor?: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="text-[14px] leading-5 font-medium text-slate-800"
                >
                    {label}
                    {required && <span className="ml-0.5 text-red-600">*</span>}
                </label>
            )}
            {children}
            {error ? (
                <span className="flex items-center gap-1 text-xs font-medium text-red-600">
                    {error}
                </span>
            ) : hint ? (
                <span className="text-xs text-slate-500">{hint}</span>
            ) : null}
        </div>
    );
}

export function AuthInput({
    invalid = false,
    icon,
    className = "",
    ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean;
    icon?: React.ReactNode;
}) {
    return (
        <div className="relative flex items-center">
            {icon && (
                <span
                    className={`pointer-events-none absolute left-3 inline-flex ${
                        invalid ? "text-red-600" : "text-slate-400"
                    }`}
                >
                    {icon}
                </span>
            )}
            <input
                className={`h-10 w-full rounded-lg border bg-white text-[14px] text-slate-800 transition placeholder:text-slate-400 focus:outline-2 focus:outline-offset-1 disabled:cursor-not-allowed disabled:bg-slate-100 ${
                    icon ? "pr-3 pl-9" : "px-3"
                } ${
                    invalid
                        ? "border-red-600 focus:border-red-600 focus:outline-red-600"
                        : "border-slate-300 focus:border-indigo-700 focus:outline-indigo-700"
                } ${className}`}
                {...rest}
            />
        </div>
    );
}

export function AuthCheckbox({
    label,
    checked,
    defaultChecked,
    disabled = false,
    onChange,
}: {
    label: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
}) {
    const [internal, setInternal] = useState(!!defaultChecked);
    const isControlled = checked !== undefined;
    const on = isControlled ? checked : internal;

    return (
        <label
            className={`inline-flex items-center gap-2 text-[14px] leading-5 select-none ${
                disabled ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-800"
            }`}
        >
            <input
                type="checkbox"
                checked={on}
                disabled={disabled}
                onChange={(e) => {
                    if (!isControlled) setInternal(e.target.checked);
                    onChange?.(e.target.checked);
                }}
                className="peer sr-only"
            />
            <span
                className={`inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-indigo-700 ${
                    on
                        ? disabled
                            ? "border-transparent bg-slate-300"
                            : "border-transparent bg-indigo-700"
                        : disabled
                          ? "border-slate-300 bg-slate-100"
                          : "border-slate-300 bg-white"
                }`}
            >
                {on && (
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                )}
            </span>
            {label}
        </label>
    );
}

export function AuthSwitch({
    label,
    checked,
    onChange,
    disabled = false,
}: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label
            className={`inline-flex items-center gap-2.5 text-[14px] leading-5 select-none ${
                disabled ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-slate-800"
            }`}
        >
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-700 ${
                    checked
                        ? disabled
                            ? "justify-end bg-slate-300"
                            : "justify-end bg-indigo-700"
                        : "justify-start bg-slate-300"
                }`}
            >
                <span className="size-4 rounded-full bg-white shadow-xs transition" />
            </button>
            {label}
        </label>
    );
}

export function OTPInput({
    value,
    onChange,
    onComplete,
    invalid = false,
    autoFocus = false,
}: {
    value: string;
    onChange: (next: string) => void;
    onComplete?: (val: string) => void;
    invalid?: boolean;
    autoFocus?: boolean;
}) {
    const refs = useRef<Array<HTMLInputElement | null>>([]);
    const digits = value.padEnd(6).split("").slice(0, 6);

    useEffect(() => {
        if (autoFocus && refs.current[0]) {
            refs.current[0].focus();
        }
    }, [autoFocus]);

    const updateValue = (next: string) => {
        onChange(next);
        if (next.length === 6 && onComplete) {
            onComplete(next);
        }
    };

    const handleChange = (index: number, rawValue: string) => {
        const digit = rawValue.replace(/\D/g, "").slice(-1);
        if (!digit) return;
        const arr = value.padEnd(6).split("");
        arr[index] = digit;
        const next = arr.join("").trimEnd();
        updateValue(next);
        if (index < 5) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
            const arr = value.padEnd(6).split("");
            if (arr[index]?.trim()) {
                arr[index] = " ";
                onChange(arr.join("").trimEnd());
            } else if (index > 0) {
                arr[index - 1] = " ";
                onChange(arr.join("").trimEnd());
                refs.current[index - 1]?.focus();
            }
        }
        if (event.key === "ArrowLeft" && index > 0) {
            refs.current[index - 1]?.focus();
        }
        if (event.key === "ArrowRight" && index < 5) {
            refs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const pasted = (event.clipboardData.getData("text") || "")
            .replace(/\D/g, "")
            .slice(0, 6);
        if (pasted) {
            event.preventDefault();
            updateValue(pasted);
            refs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };

    return (
        <div className="flex w-full justify-center gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => {
                const filled = d.trim() !== "";
                return (
                    <input
                        key={i}
                        ref={(el) => {
                            refs.current[i] = el;
                        }}
                        inputMode="numeric"
                        maxLength={1}
                        value={d.trim()}
                        aria-label={`Digit ${i + 1}`}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`h-14 max-w-[52px] min-w-0 flex-1 rounded-lg border-[1.5px] bg-white text-center text-[22px] font-semibold text-slate-800 outline-none transition focus:border-indigo-700 focus:ring-1 focus:ring-indigo-700 ${
                            invalid
                                ? "border-red-600"
                                : filled
                                  ? "border-indigo-700 ring-1 ring-indigo-700"
                                  : "border-slate-300"
                        }`}
                    />
                );
            })}
        </div>
    );
}

export function useCountdown(seconds: number, running = true) {
    const [t, setT] = useState(seconds);

    useEffect(() => {
        if (!running || t <= 0) return;
        const id = setTimeout(() => setT((v) => v - 1), 1000);
        return () => clearTimeout(id);
    }, [t, running]);

    const mm = Math.floor(t / 60);
    const ss = t % 60;
    return {
        t,
        label: `${mm}:${String(ss).padStart(2, "0")}`,
        reset: () => setT(seconds),
    };
}

export function ResendRow({
    validity = 300,
    unlockAfter = 30,
    onResend,
}: {
    validity?: number;
    unlockAfter?: number;
    onResend?: () => void;
}) {
    const cd = useCountdown(validity);
    const canResend = cd.t <= validity - unlockAfter;

    return (
        <div className="flex items-center justify-center gap-1.5 text-[13px] text-slate-500">
            {cd.t > 0 ? (
                <span>
                    Code expires in{" "}
                    <strong className="font-semibold text-slate-700 tabular-nums">
                        {cd.label}
                    </strong>
                </span>
            ) : (
                <span className="text-red-600">Code expired.</span>
            )}
            <span className="text-slate-300">·</span>
            <button
                type="button"
                disabled={!canResend && cd.t > 0}
                onClick={() => {
                    cd.reset();
                    onResend?.();
                }}
                className={`font-semibold ${
                    canResend || cd.t <= 0
                        ? "cursor-pointer text-indigo-700 hover:underline"
                        : "cursor-not-allowed text-slate-400"
                }`}
            >
                Resend code
            </button>
        </div>
    );
}

export function Stepper({
    current,
    total = 2,
    labels = [],
}: {
    current: number;
    total?: number;
    labels?: string[];
}) {
    return (
        <div className="mb-5.5">
            <div className="mb-2 flex gap-1.5">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                            i < current ? "bg-indigo-700" : "bg-slate-200"
                        }`}
                    />
                ))}
            </div>
            <div className="text-xs font-semibold tracking-wider text-indigo-700 uppercase">
                Step {current} of {total}
                {labels[current - 1] ? ` · ${labels[current - 1]}` : ""}
            </div>
        </div>
    );
}

export function PasswordField({
    id,
    value,
    onChange,
    placeholder,
    invalid = false,
    autoComplete,
}: {
    id: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    invalid?: boolean;
    autoComplete?: string;
}) {
    const [show, setShow] = useState(false);

    return (
        <div className="relative">
            <AuthInput
                id={id}
                type={show ? "text" : "password"}
                value={value}
                invalid={invalid}
                autoComplete={autoComplete}
                onChange={onChange}
                placeholder={placeholder}
                className="pr-10"
            />
            <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2.5 inline-flex -translate-y-1/2 cursor-pointer p-1 text-slate-500 hover:text-slate-700"
            >
                <AuthIcon name={show ? "EyeOff" : "Eye"} size={18} />
            </button>
        </div>
    );
}

const PASSWORD_RULES = [
    { id: "len", label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    {
        id: "case",
        label: "Upper & lowercase letters",
        test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
    },
    { id: "num", label: "At least one number", test: (p: string) => /\d/.test(p) },
    { id: "sym", label: "At least one symbol", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function passwordValid(password: string): boolean {
    return PASSWORD_RULES.every((r) => r.test(password));
}

export function Complexity({ value }: { value: string }) {
    return (
        <div className="mt-1 grid grid-cols-1 gap-x-3.5 gap-y-1.5 sm:grid-cols-2">
            {PASSWORD_RULES.map((r) => {
                const ok = value.length > 0 && r.test(value);
                return (
                    <div
                        key={r.id}
                        className={`flex items-center gap-1.5 text-[12.5px] ${
                            ok ? "text-[#16A34A]" : "text-slate-500"
                        }`}
                    >
                        <span className={ok ? "text-[#16A34A]" : "text-slate-300"}>
                            <AuthIcon name={ok ? "CheckCircle2" : "Circle"} size={15} />
                        </span>
                        {r.label}
                    </div>
                );
            })}
        </div>
    );
}

export function Avatar({
    name,
    avatarUrl,
    size = 32,
}: {
    name: string;
    avatarUrl?: string | null;
    size?: number;
}) {
    const initials = name
        .replace(/^Dr\.\s*/, "")
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    if (avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={avatarUrl}
                alt={name}
                style={{ width: size, height: size }}
                className="shrink-0 rounded-full border border-slate-200 object-cover"
            />
        );
    }

    return (
        <span
            style={{ width: size, height: size, fontSize: size * 0.4 }}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700"
        >
            {initials || "U"}
        </span>
    );
}

export function ReadOnlyField({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: AuthIconName;
}) {
    return (
        <div>
            <div className="mb-1.5 text-[13px] font-medium text-slate-600">{label}</div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[14px] text-slate-500">
                <span className="text-slate-400">
                    <AuthIcon name={icon} size={16} />
                </span>
                <span className="truncate">{value}</span>
                <span className="ml-auto text-slate-400">
                    <AuthIcon name="Lock" size={13} />
                </span>
            </div>
        </div>
    );
}
