"use client";

import React, { useId, useState } from "react";
import {
    type DashboardRoleId,
    type RagCounts,
    type RagStatus,
    THRIVE_DASH,
} from "./dashboard-data";

export const RAG_COLOR: Record<RagStatus, string> = {
    green: "var(--green-600)",
    amber: "var(--amber-600)",
    red: "var(--red-600)",
};

export function Icon({
    name,
    size = 20,
    color = "currentColor",
    style,
}: {
    name: string;
    size?: number;
    color?: string;
    style?: React.CSSProperties;
}) {
    const svgProps = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: 2,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
    };

    const renderSvg = () => {
        switch (name) {
            case "LayoutDashboard":
                return (
                    <svg {...svgProps}>
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                    </svg>
                );
            case "Bell":
                return (
                    <svg {...svgProps}>
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                );
            case "Calendar":
                return (
                    <svg {...svgProps}>
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                    </svg>
                );
            case "CalendarDays":
                return (
                    <svg {...svgProps}>
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                        <path d="M8 14h.01" />
                        <path d="M12 14h.01" />
                        <path d="M16 14h.01" />
                        <path d="M8 18h.01" />
                        <path d="M12 18h.01" />
                        <path d="M16 18h.01" />
                    </svg>
                );
            case "CalendarCheck":
                return (
                    <svg {...svgProps}>
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                        <path d="m9 16 2 2 4-4" />
                    </svg>
                );
            case "CalendarX":
                return (
                    <svg {...svgProps}>
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                        <path d="m14 14-4 4" />
                        <path d="m10 14 4 4" />
                    </svg>
                );
            case "CalendarClock":
                return (
                    <svg {...svgProps}>
                        <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
                        <path d="M16 2v4" />
                        <path d="M8 2v4" />
                        <path d="M3 10h5" />
                        <path d="M17.5 17.5 16 16.3V14" />
                        <circle cx="16" cy="16" r="6" />
                    </svg>
                );
            case "CalendarRange":
                return (
                    <svg {...svgProps}>
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M16 2v4" />
                        <path d="M8 2v4" />
                        <path d="M3 10h18" />
                        <path d="M17 14h-6" />
                        <path d="M13 18H7" />
                        <path d="M7 14h.01" />
                        <path d="M17 18h.01" />
                    </svg>
                );
            case "ListChecks":
                return (
                    <svg {...svgProps}>
                        <path d="m3 17 2 2 4-4" />
                        <path d="m3 7 2 2 4-4" />
                        <path d="M13 6h8" />
                        <path d="M13 12h8" />
                        <path d="M13 18h8" />
                    </svg>
                );
            case "CheckSquare":
                return (
                    <svg {...svgProps}>
                        <path d="m9 11 3 3L22 4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                );
            case "History":
                return (
                    <svg {...svgProps}>
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M12 7v5l4 2" />
                    </svg>
                );
            case "Zap":
                return (
                    <svg {...svgProps}>
                        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
                    </svg>
                );
            case "Activity":
                return (
                    <svg {...svgProps}>
                        <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
                    </svg>
                );
            case "Search":
                return (
                    <svg {...svgProps}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                );
            case "ArrowLeft":
                return (
                    <svg {...svgProps}>
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg>
                );
            case "ArrowRightCircle":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8" />
                        <path d="m12 16 4-4-4-4" />
                    </svg>
                );
            case "ChevronRight":
                return (
                    <svg {...svgProps}>
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                );
            case "Clock":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                );
            case "BookOpen":
                return (
                    <svg {...svgProps}>
                        <path d="M12 7v14" />
                        <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                    </svg>
                );
            case "BookMarked":
                return (
                    <svg {...svgProps}>
                        <path d="M10 2v8l3-3 3 3V2" />
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                    </svg>
                );
            case "Star":
                return (
                    <svg {...svgProps}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                );
            case "FileText":
                return (
                    <svg {...svgProps}>
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="M10 9H8" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                    </svg>
                );
            case "FileEdit":
                return (
                    <svg {...svgProps}>
                        <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
                    </svg>
                );
            case "FileDown":
                return (
                    <svg {...svgProps}>
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="M12 18v-6" />
                        <path d="m9 15 3 3 3-3" />
                    </svg>
                );
            case "Sheet":
                return (
                    <svg {...svgProps}>
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <line x1="3" x2="21" y1="9" y2="9" />
                        <line x1="3" x2="21" y1="15" y2="15" />
                        <line x1="9" x2="9" y1="9" y2="21" />
                        <line x1="15" x2="15" y1="9" y2="21" />
                    </svg>
                );
            case "ClipboardCheck":
                return (
                    <svg {...svgProps}>
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <path d="m9 14 2 2 4-4" />
                    </svg>
                );
            case "CheckCircle2":
            case "CircleCheck":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                );
            case "XCircle":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                    </svg>
                );
            case "Check":
                return (
                    <svg {...svgProps}>
                        <path d="M20 6 9 17l-5-5" />
                    </svg>
                );
            case "CheckCheck":
                return (
                    <svg {...svgProps}>
                        <path d="M18 6 7 17l-5-5" />
                        <path d="m22 10-7.5 7.5L13 16" />
                    </svg>
                );
            case "X":
                return (
                    <svg {...svgProps}>
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                );
            case "Users":
                return (
                    <svg {...svgProps}>
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                );
            case "User":
                return (
                    <svg {...svgProps}>
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                );
            case "Inbox":
                return (
                    <svg {...svgProps}>
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                    </svg>
                );
            case "AlertTriangle":
                return (
                    <svg {...svgProps}>
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                    </svg>
                );
            case "AlertOctagon":
                return (
                    <svg {...svgProps}>
                        <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>
                );
            case "CircleDot":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="1" />
                    </svg>
                );
            case "Building2":
                return (
                    <svg {...svgProps}>
                        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                        <path d="M10 6h4" />
                        <path d="M10 10h4" />
                        <path d="M10 14h4" />
                        <path d="M10 18h4" />
                    </svg>
                );
            case "Download":
                return (
                    <svg {...svgProps}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                );
            case "ShieldCheck":
                return (
                    <svg {...svgProps}>
                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                );
            case "Award":
                return (
                    <svg {...svgProps}>
                        <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                        <circle cx="12" cy="8" r="6" />
                    </svg>
                );
            case "LifeBuoy":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="m4.93 4.93 4.24 4.24" />
                        <path d="m14.83 9.17 4.24-4.24" />
                        <path d="m14.83 14.83 4.24 4.24" />
                        <path d="m9.17 14.83-4.24 4.24" />
                        <circle cx="12" cy="12" r="4" />
                    </svg>
                );
            case "FolderCheck":
                return (
                    <svg {...svgProps}>
                        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                        <path d="m9 13 2 2 4-4" />
                    </svg>
                );
            case "Flag":
                return (
                    <svg {...svgProps}>
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                        <line x1="4" x2="4" y1="22" y2="15" />
                    </svg>
                );
            case "Scale":
                return (
                    <svg {...svgProps}>
                        <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                        <path d="M7 21h10" />
                        <path d="M12 3v18" />
                        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                    </svg>
                );
            case "PackageOpen":
                return (
                    <svg {...svgProps}>
                        <path d="M12 22v-9" />
                        <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
                        <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
                        <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" />
                    </svg>
                );
            case "Handshake":
                return (
                    <svg {...svgProps}>
                        <path d="m11 17 2 2a1 1 0 1 0 3-3" />
                        <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
                        <path d="m21 3 1 11h-2" />
                        <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
                        <path d="M3 4h8" />
                    </svg>
                );
            case "Monitor":
                return (
                    <svg {...svgProps}>
                        <rect width="20" height="14" x="2" y="3" rx="2" />
                        <line x1="8" x2="16" y1="21" y2="21" />
                        <line x1="12" x2="12" y1="17" y2="21" />
                    </svg>
                );
            case "Smartphone":
                return (
                    <svg {...svgProps}>
                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                        <path d="M12 18h.01" />
                    </svg>
                );
            case "HelpCircle":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                    </svg>
                );
            case "SlidersHorizontal":
                return (
                    <svg {...svgProps}>
                        <line x1="21" x2="14" y1="4" y2="4" />
                        <line x1="10" x2="3" y1="4" y2="4" />
                        <line x1="21" x2="12" y1="12" y2="12" />
                        <line x1="8" x2="3" y1="12" y2="12" />
                        <line x1="21" x2="16" y1="20" y2="20" />
                        <line x1="12" x2="3" y1="20" y2="20" />
                        <line x1="14" x2="14" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="10" y2="14" />
                        <line x1="16" x2="16" y1="18" y2="22" />
                    </svg>
                );
            case "Sprout":
                return (
                    <svg {...svgProps}>
                        <path d="M7 20h10" />
                        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
                        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
                        <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
                    </svg>
                );
            case "Info":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4" />
                        <path d="M12 8h.01" />
                    </svg>
                );
            case "LocateFixed":
                return (
                    <svg {...svgProps}>
                        <line x1="2" x2="5" y1="12" y2="12" />
                        <line x1="19" x2="22" y1="12" y2="12" />
                        <line x1="12" x2="12" y1="2" y2="5" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                        <circle cx="12" cy="12" r="7" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                );
            case "PartyPopper":
                return (
                    <svg {...svgProps}>
                        <path d="M5.8 11.3 2 22l10.7-3.79" />
                        <path d="M4 3h.01" />
                        <path d="M22 8h.01" />
                        <path d="M15 2h.01" />
                        <path d="M22 20h.01" />
                        <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                        <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" />
                        <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" />
                        <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
                    </svg>
                );
            case "Target":
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                    </svg>
                );
            case "Hammer":
                return (
                    <svg {...svgProps}>
                        <path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9" />
                        <path d="M17.64 15 22 10.64" />
                        <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91" />
                    </svg>
                );
            case "KeyRound":
                return (
                    <svg {...svgProps}>
                        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                    </svg>
                );
            case "LogOut":
                return (
                    <svg {...svgProps}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                );
            default:
                return (
                    <svg {...svgProps}>
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                );
        }
    };

    return (
        <span style={{ display: "inline-flex", ...style }}>
            {renderSvg()}
        </span>
    );
}

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
    const initials = name
        .replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, "")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");
    return (
        <span
            style={{
                width: size,
                height: size,
                flex: `0 0 ${size}px`,
                borderRadius: "50%",
                background: "var(--indigo-100)",
                color: "var(--indigo-700)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: size * 0.4,
                fontWeight: 600,
                fontFamily: "var(--font-sans)",
            }}
        >
            {initials}
        </span>
    );
}

export function ProgressBar({
    value = 0,
    max = 100,
    label,
    showValue = true,
    color = "var(--indigo-700)",
    height = 8,
    style,
}: {
    value?: number;
    max?: number;
    label?: React.ReactNode;
    showValue?: boolean;
    color?: string;
    height?: number;
    style?: React.CSSProperties;
}) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontFamily: "var(--font-sans)",
                ...style,
            }}
        >
            {(label || showValue) && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        gap: 12,
                    }}
                >
                    {label && (
                        <span
                            style={{
                                fontSize: 14,
                                lineHeight: "20px",
                                fontWeight: 500,
                                color: "var(--slate-800)",
                            }}
                        >
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span
                            style={{
                                fontSize: 12,
                                lineHeight: "16px",
                                fontWeight: 600,
                                color: "var(--slate-500)",
                                fontFeatureSettings: '"tnum" 1',
                            }}
                        >
                            {Math.round(pct)}%
                        </span>
                    )}
                </div>
            )}
            <div
                style={{
                    width: "100%",
                    height,
                    borderRadius: "var(--radius-pill)",
                    background: "var(--slate-100)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: color,
                        borderRadius: "var(--radius-pill)",
                        transition: "width .3s",
                    }}
                />
            </div>
        </div>
    );
}

export function RAGBar({
    data = { green: 0, amber: 0, red: 0 },
    height = 12,
    showLegend = true,
    style,
}: {
    data?: RagCounts;
    height?: number;
    showLegend?: boolean;
    style?: React.CSSProperties;
}) {
    const total = (data.green || 0) + (data.amber || 0) + (data.red || 0);
    const pct = (n: number) => (total ? (n / total) * 100 : 0);
    const order: RagStatus[] = ["green", "amber", "red"];
    const labels: Record<RagStatus, string> = {
        green: "On Track",
        amber: "At Risk",
        red: "Delayed",
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontFamily: "var(--font-sans)",
                ...style,
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    height,
                    borderRadius: "var(--radius-pill)",
                    overflow: "hidden",
                    background: "var(--slate-100)",
                }}
            >
                {order.map((k) =>
                    data[k] ? (
                        <div
                            key={k}
                            title={`${labels[k]}: ${data[k]}`}
                            style={{
                                width: `${pct(data[k])}%`,
                                background: RAG_COLOR[k],
                            }}
                        />
                    ) : null
                )}
            </div>
            {showLegend && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                    {order.map((k) => (
                        <span
                            key={k}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 12,
                                lineHeight: "16px",
                                fontWeight: 500,
                                color: "var(--slate-800)",
                            }}
                        >
                            <span
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: RAG_COLOR[k],
                                }}
                            />
                            {labels[k]}
                            <span
                                style={{
                                    color: "var(--slate-500)",
                                    fontFeatureSettings: '"tnum" 1',
                                }}
                            >
                                {data[k] || 0} · {Math.round(pct(data[k]))}%
                            </span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export function TrendLine({
    data = [],
    width = 240,
    height = 56,
    color = "var(--indigo-700)",
    fill = true,
    style,
}: {
    data?: number[];
    width?: number;
    height?: number;
    color?: string;
    fill?: boolean;
    style?: React.CSSProperties;
}) {
    const rawId = useId();
    const gid = rawId.replace(/:/g, "");

    if (data.length < 2) {
        return <svg width={width} height={height} style={style} />;
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = width / (data.length - 1);
    const pad = 4;
    const y = (v: number) => height - pad - ((v - min) / range) * (height - pad * 2);
    const pts = data.map((v, i) => [i * stepX, y(v)]);
    const line = pts
        .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
        .join(" ");
    const area = `${line} L${width} ${height} L0 ${height} Z`;

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ display: "block", overflow: "visible", ...style }}
        >
            {fill && (
                <>
                    <defs>
                        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.16" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={area} fill={`url(#${gid})`} />
                </>
            )}
            <path
                d={line}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx={pts[pts.length - 1][0]}
                cy={pts[pts.length - 1][1]}
                r="3"
                fill={color}
            />
        </svg>
    );
}

const BADGE_TONES = {
    neutral: { bg: "var(--slate-100)", fg: "var(--slate-800)" },
    brand: { bg: "var(--indigo-50)", fg: "var(--indigo-900)" },
    green: { bg: "var(--green-fill)", fg: "var(--green-600)" },
    amber: { bg: "var(--amber-fill)", fg: "var(--amber-600)" },
    red: { bg: "var(--red-fill)", fg: "var(--red-600)" },
};

export function Badge({
    tone = "neutral",
    icon = null,
    children,
    style,
}: {
    tone?: keyof typeof BADGE_TONES;
    icon?: React.ReactNode;
    children: React.ReactNode;
    style?: React.CSSProperties;
}) {
    const t = BADGE_TONES[tone] || BADGE_TONES.neutral;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 8px",
                borderRadius: "var(--radius-pill)",
                background: t.bg,
                color: t.fg,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                lineHeight: "16px",
                fontWeight: 500,
                ...style,
            }}
        >
            {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
            {children}
        </span>
    );
}

export function ContentCard({
    title,
    action,
    children,
    padding = "var(--space-6)",
    style,
}: {
    title?: React.ReactNode;
    action?: React.ReactNode;
    children: React.ReactNode;
    padding?: string | number;
    style?: React.CSSProperties;
}) {
    return (
        <div
            style={{
                background: "var(--surface-card)",
                border: "1px solid var(--slate-200)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                ...style,
            }}
        >
            {(title || action) && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 12,
                        padding: `var(--space-4) ${padding === "0" || padding === 0 ? "var(--space-5, 20px)" : padding}`,
                        borderBottom: "1px solid var(--slate-200)",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 18,
                            lineHeight: "26px",
                            fontWeight: 600,
                            color: "var(--slate-800)",
                        }}
                    >
                        {title}
                    </span>
                    {action}
                </div>
            )}
            <div style={{ padding }}>{children}</div>
        </div>
    );
}

export type DataTableColumn<T> = {
    key: string;
    header: string;
    width?: number | string;
    align?: "left" | "right" | "center";
    numeric?: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (val: any, row: T, index: number) => React.ReactNode;
};

export function DataTable<T extends Record<string, unknown>>({
    columns = [],
    rows = [],
    dense = false,
    zebra,
    getRowKey,
    onRowClick,
    style,
}: {
    columns: DataTableColumn<T>[];
    rows: T[];
    dense?: boolean;
    zebra?: boolean;
    getRowKey?: (row: T, index: number) => React.Key;
    onRowClick?: (row: T, index: number) => void;
    style?: React.CSSProperties;
}) {
    const rowH = dense ? 40 : 48;
    const striped = zebra !== undefined ? zebra : rows.length > 5;
    return (
        <div
            style={{
                border: "1px solid var(--slate-200)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                background: "var(--surface-card)",
                ...style,
            }}
        >
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "var(--font-sans)",
                }}
            >
                <thead>
                    <tr style={{ height: rowH, background: "var(--slate-100)" }}>
                        {columns.map((c, idx) => (
                            <th
                                key={`${c.key}-${c.header}-${idx}`}
                                style={{
                                    textAlign: c.align || "left",
                                    padding: "0 16px",
                                    width: c.width,
                                    fontSize: 12,
                                    lineHeight: "16px",
                                    fontWeight: 600,
                                    color: "var(--slate-800)",
                                    position: "sticky",
                                    top: 0,
                                    background: "var(--slate-100)",
                                    whiteSpace: "nowrap",
                                    borderBottom: "1px solid var(--slate-200)",
                                }}
                            >
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr
                            key={getRowKey ? getRowKey(r, i) : i}
                            onClick={onRowClick ? () => onRowClick(r, i) : undefined}
                            style={{
                                height: rowH,
                                cursor: onRowClick ? "pointer" : "default",
                                background: striped && i % 2 === 1 ? "var(--slate-50)" : "#fff",
                                borderBottom:
                                    i < rows.length - 1 ? "1px solid var(--slate-200)" : "none",
                            }}
                            onMouseEnter={(e) => {
                                if (onRowClick)
                                    e.currentTarget.style.background = "var(--indigo-50)";
                            }}
                            onMouseLeave={(e) => {
                                if (onRowClick)
                                    e.currentTarget.style.background =
                                        striped && i % 2 === 1 ? "var(--slate-50)" : "#fff";
                            }}
                        >
                            {columns.map((c, idx) => (
                                <td
                                    key={`${c.key}-${c.header}-${idx}`}
                                    style={{
                                        textAlign: c.align || "left",
                                        padding: "0 16px",
                                        fontSize: 14,
                                        lineHeight: "20px",
                                        color: "var(--slate-800)",
                                        fontFeatureSettings: c.numeric ? '"tnum" 1' : undefined,
                                    }}
                                >
                                    {c.render
                                        ? c.render(r[c.key], r, i)
                                        : (r[c.key] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const TREND_MAP = {
    up: { color: "var(--green-600)", sign: "▲" },
    down: { color: "var(--red-600)", sign: "▼" },
    flat: { color: "var(--slate-500)", sign: "—" },
};

export function MetricCard({
    label,
    value,
    unit,
    trend,
    trendLabel,
    icon,
    style,
}: {
    label: string;
    value: React.ReactNode;
    unit?: string;
    trend?: "up" | "down" | "flat";
    trendLabel?: string;
    icon?: React.ReactNode;
    style?: React.CSSProperties;
}) {
    const t = trend ? TREND_MAP[trend] || TREND_MAP.flat : null;
    return (
        <div
            style={{
                background: "var(--surface-card)",
                border: "1px solid var(--slate-200)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-sm)",
                padding: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                ...style,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        lineHeight: "16px",
                        fontWeight: 500,
                        color: "var(--slate-500)",
                    }}
                >
                    {label}
                </span>
                {icon && (
                    <span style={{ color: "var(--slate-400)", display: "inline-flex" }}>
                        {icon}
                    </span>
                )}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                    style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: 32,
                        lineHeight: "40px",
                        fontWeight: 700,
                        color: "var(--slate-800)",
                        fontFeatureSettings: '"tnum" 1',
                    }}
                >
                    {value}
                </span>
                {unit && (
                    <span
                        style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 16,
                            fontWeight: 600,
                            color: "var(--slate-500)",
                        }}
                    >
                        {unit}
                    </span>
                )}
            </div>
            {t && (
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontFamily: "var(--font-sans)",
                        fontSize: 12,
                        lineHeight: "16px",
                        fontWeight: 500,
                        color: t.color,
                    }}
                >
                    <span style={{ fontSize: 10 }}>{t.sign}</span>
                    {trendLabel}
                </span>
            )}
        </div>
    );
}

const RAG_META: Record<RagStatus, { dot: string; label: string }> = {
    green: { dot: "var(--green-600)", label: "On Track" },
    amber: { dot: "var(--amber-600)", label: "At Risk" },
    red: { dot: "var(--red-600)", label: "Delayed" },
};

export function RAGBadge({
    status = "green",
    label,
    countdown,
    emphasis = false,
    style,
}: {
    status?: RagStatus;
    label?: string;
    countdown?: string;
    emphasis?: boolean;
    style?: React.CSSProperties;
}) {
    const cfg = RAG_META[status] || RAG_META.green;
    const text = label || cfg.label;
    const bordered = emphasis || status === "red";
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "var(--font-sans)",
                fontSize: 12,
                lineHeight: "16px",
                fontWeight: 500,
                color: "var(--slate-800)",
                padding: bordered ? "3px 8px" : 0,
                border: bordered ? `1px solid ${cfg.dot}` : "none",
                borderRadius: bordered ? "var(--radius-md)" : 0,
                background: bordered && status === "red" ? "var(--red-fill)" : "transparent",
                ...style,
            }}
        >
            <span
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: cfg.dot,
                    flex: "0 0 8px",
                }}
            />
            {text}
            {countdown && <span style={{ color: "var(--slate-500)" }}>· {countdown}</span>}
        </span>
    );
}

const BTN_SIZES = {
    sm: { fontSize: 14, lineHeight: "20px", padding: "6px 12px", height: 32, gap: 6 },
    md: { fontSize: 14, lineHeight: "20px", padding: "9px 16px", height: 40, gap: 8 },
    lg: { fontSize: 16, lineHeight: "24px", padding: "11px 20px", height: 48, gap: 8 },
};

const BTN_VARIANTS = {
    primary: {
        base: {
            background: "var(--indigo-700)",
            color: "#fff",
            border: "1px solid transparent",
        },
        hover: { filter: "brightness(0.92)" },
        active: { filter: "brightness(0.88)" },
    },
    secondary: {
        base: {
            background: "#fff",
            color: "var(--slate-800)",
            border: "1px solid var(--slate-300)",
        },
        hover: { background: "var(--slate-50)" },
        active: { background: "var(--slate-100)" },
    },
    ghost: {
        base: {
            background: "transparent",
            color: "var(--indigo-700)",
            border: "1px solid transparent",
        },
        hover: { background: "var(--indigo-50)" },
        active: { background: "var(--indigo-100)" },
    },
    danger: {
        base: {
            background: "var(--red-600)",
            color: "#fff",
            border: "1px solid transparent",
        },
        hover: { filter: "brightness(0.92)" },
        active: { filter: "brightness(0.88)" },
    },
};

export function Button({
    variant = "primary",
    size = "md",
    icon = null,
    iconRight = null,
    loading = false,
    disabled = false,
    type = "button",
    children,
    style,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: keyof typeof BTN_VARIANTS;
    size?: keyof typeof BTN_SIZES;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
    loading?: boolean;
}) {
    const [state, setState] = useState<"base" | "hover" | "active" | "focus">("base");
    const sz = BTN_SIZES[size] || BTN_SIZES.md;
    const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
    const isDisabled = disabled || loading;

    const disabledStyle: React.CSSProperties = {
        background: "var(--slate-200)",
        color: "var(--slate-400)",
        border: "1px solid transparent",
        boxShadow: "none",
        cursor: "not-allowed",
        filter: "none",
    };

    const composed: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: sz.gap,
        height: sz.height,
        padding: sz.padding,
        fontFamily: "var(--font-sans)",
        fontSize: sz.fontSize,
        lineHeight: sz.lineHeight,
        fontWeight: 600,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        userSelect: "none",
        transition: "filter .12s, background .12s",
        outline: state === "focus" ? "2px solid var(--indigo-700)" : "none",
        outlineOffset: state === "focus" ? 2 : 0,
        ...v.base,
        ...(!isDisabled && state === "hover" ? v.hover : {}),
        ...(!isDisabled && state === "active" ? v.active : {}),
        ...(isDisabled ? disabledStyle : {}),
        ...style,
    };

    return (
        <button
            type={type}
            disabled={isDisabled}
            style={composed}
            onMouseEnter={() => setState("hover")}
            onMouseLeave={() => setState("base")}
            onMouseDown={() => setState("active")}
            onMouseUp={() => setState("hover")}
            onFocus={() => setState("focus")}
            onBlur={() => setState("base")}
            {...rest}
        >
            {loading ? (
                <span
                    style={{
                        width: 16,
                        height: 16,
                        border: "2px solid currentColor",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        display: "inline-block",
                        animation: "dia-spin .7s linear infinite",
                    }}
                />
            ) : (
                <>
                    {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
                    {children}
                    {iconRight && <span style={{ display: "inline-flex" }}>{iconRight}</span>}
                </>
            )}
        </button>
    );
}

const ICON_BTN_SIZES = { sm: 32, md: 40, lg: 48 };

export function IconButton({
    icon,
    label,
    size = "md",
    variant = "ghost",
    disabled = false,
    style,
    ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
    label: string;
    size?: keyof typeof ICON_BTN_SIZES;
    variant?: "ghost" | "danger";
}) {
    const [hover, setHover] = useState(false);
    const [focus, setFocus] = useState(false);
    const dim = ICON_BTN_SIZES[size] || ICON_BTN_SIZES.md;
    const bg = disabled
        ? "transparent"
        : hover
          ? variant === "danger"
              ? "var(--red-fill)"
              : "var(--slate-100)"
          : "transparent";
    const color = disabled
        ? "var(--slate-300)"
        : variant === "danger"
          ? "var(--red-600)"
          : "var(--slate-600)";

    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            disabled={disabled}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={{
                width: dim,
                height: dim,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: bg,
                color,
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "background .12s",
                outline: focus ? "2px solid var(--indigo-700)" : "none",
                outlineOffset: 2,
                ...style,
            }}
            {...rest}
        >
            {icon}
        </button>
    );
}

export function Input({
    invalid = false,
    icon = null,
    disabled = false,
    style,
    ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean;
    icon?: React.ReactNode;
}) {
    const [focus, setFocus] = useState(false);
    const border = invalid
        ? "var(--red-600)"
        : focus
          ? "var(--indigo-700)"
          : "var(--slate-300)";
    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            {icon && (
                <span
                    style={{
                        position: "absolute",
                        left: 12,
                        color: invalid ? "var(--red-600)" : "var(--slate-400)",
                        display: "inline-flex",
                        pointerEvents: "none",
                    }}
                >
                    {icon}
                </span>
            )}
            <input
                disabled={disabled}
                onFocus={(e) => {
                    setFocus(true);
                    rest.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setFocus(false);
                    rest.onBlur?.(e);
                }}
                style={{
                    width: "100%",
                    height: 40,
                    boxSizing: "border-box",
                    padding: icon ? "9px 12px 9px 36px" : "9px 12px",
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    lineHeight: "20px",
                    color: "var(--slate-800)",
                    background: disabled ? "var(--slate-100)" : "#fff",
                    border: `1px solid ${border}`,
                    borderRadius: "var(--radius-md)",
                    outline: focus
                        ? `2px solid ${invalid ? "var(--red-600)" : "var(--indigo-700)"}`
                        : "none",
                    outlineOffset: 1,
                    boxShadow: "none",
                    transition: "border-color .12s",
                    cursor: disabled ? "not-allowed" : "text",
                    ...style,
                }}
                {...rest}
            />
        </div>
    );
}

export type SideNavItem =
    | { heading: string; id?: undefined }
    | {
          id: string;
          label: string;
          icon?: React.ReactNode;
          badge?: number | string;
          heading?: undefined;
      };

export function SideNav({
    items = [],
    activeId,
    collapsed = false,
    onSelect,
    header,
    footer,
    style,
}: {
    items: SideNavItem[];
    activeId: string;
    collapsed?: boolean;
    onSelect?: (id: string) => void;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    style?: React.CSSProperties;
}) {
    const width = collapsed ? 64 : 240;
    return (
        <nav
            style={{
                width,
                flex: `0 0 ${width}px`,
                background: "var(--slate-50)",
                borderRight: "1px solid var(--slate-200)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "width .15s",
                fontFamily: "var(--font-sans)",
                ...style,
            }}
        >
            {header && (
                <div
                    style={{
                        padding: collapsed ? "16px 0" : "16px",
                        display: "flex",
                        justifyContent: collapsed ? "center" : "flex-start",
                    }}
                >
                    {header}
                </div>
            )}
            <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                {items.map((it, i) => {
                    if ("heading" in it && it.heading !== undefined) {
                        return collapsed ? (
                            <div key={i} style={{ height: 16 }} />
                        ) : (
                            <div
                                key={i}
                                style={{
                                    padding: "12px 12px 4px",
                                    fontSize: 12,
                                    lineHeight: "16px",
                                    fontWeight: 600,
                                    color: "var(--slate-400)",
                                    textTransform: "uppercase",
                                    letterSpacing: ".04em",
                                }}
                            >
                                {it.heading}
                            </div>
                        );
                    }
                    const active = it.id === activeId;
                    return (
                        <button
                            key={it.id}
                            type="button"
                            onClick={() => it.id && onSelect?.(it.id)}
                            title={collapsed ? it.label : undefined}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: collapsed ? "10px 0" : "10px 12px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                marginBottom: 2,
                                border: "none",
                                cursor: "pointer",
                                textAlign: "left",
                                borderRadius: "var(--radius-md)",
                                position: "relative",
                                borderLeft: active
                                    ? "3px solid var(--indigo-700)"
                                    : "3px solid transparent",
                                background: active ? "var(--indigo-50)" : "transparent",
                                color: active ? "var(--indigo-700)" : "var(--slate-800)",
                                fontSize: 14,
                                lineHeight: "20px",
                                fontWeight: active ? 600 : 500,
                            }}
                            onMouseEnter={(e) => {
                                if (!active)
                                    e.currentTarget.style.background = "var(--slate-100)";
                            }}
                            onMouseLeave={(e) => {
                                if (!active) e.currentTarget.style.background = "transparent";
                            }}
                        >
                            {it.icon && (
                                <span style={{ display: "inline-flex", flex: "none" }}>
                                    {it.icon}
                                </span>
                            )}
                            {!collapsed && (
                                <span
                                    style={{
                                        flex: 1,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {it.label}
                                </span>
                            )}
                            {!collapsed && it.badge != null && (
                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: "var(--slate-500)",
                                        fontFeatureSettings: '"tnum" 1',
                                    }}
                                >
                                    {it.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
            {footer && (
                <div style={{ padding: "8px", borderTop: "1px solid var(--slate-200)" }}>
                    {footer}
                </div>
            )}
        </nav>
    );
}

export function TopBar({
    brand,
    search,
    actions,
    style,
}: {
    brand?: React.ReactNode;
    search?: React.ReactNode;
    actions?: React.ReactNode;
    style?: React.CSSProperties;
}) {
    return (
        <header
            style={{
                height: 64,
                flex: "none",
                background: "#fff",
                borderBottom: "1px solid var(--slate-200)",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0 24px",
                fontFamily: "var(--font-sans)",
                ...style,
            }}
        >
            {brand && (
                <div style={{ display: "flex", alignItems: "center", flex: "none" }}>
                    {brand}
                </div>
            )}
            {search && (
                <div style={{ flex: 1, maxWidth: 480, marginLeft: 8 }}>{search}</div>
            )}
            <div style={{ flex: search ? "none" : 1, marginLeft: "auto" }} />
            {actions && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flex: "none",
                    }}
                >
                    {actions}
                </div>
            )}
        </header>
    );
}

// ---------- Shared Module-2 Dashboard Widgets (Widgets.jsx) ----------

export function PageHeader({
    eyebrow,
    title,
    sub,
    actions,
}: {
    eyebrow?: string;
    title: string;
    sub?: string;
    actions?: React.ReactNode;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 20,
            }}
        >
            <div style={{ minWidth: 0 }}>
                {eyebrow && (
                    <div
                        style={{
                            fontSize: 12,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: ".04em",
                            color: "var(--slate-400)",
                        }}
                    >
                        {eyebrow}
                    </div>
                )}
                <h1
                    style={{
                        fontSize: 26,
                        lineHeight: "34px",
                        fontWeight: 700,
                        color: "var(--slate-800)",
                        margin: "4px 0 0",
                        letterSpacing: "-0.4px",
                    }}
                >
                    {title}
                </h1>
                {sub && (
                    <div style={{ fontSize: 14, color: "var(--slate-500)", marginTop: 4 }}>
                        {sub}
                    </div>
                )}
            </div>
            {actions && (
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>
            )}
        </div>
    );
}

export function QuickActions({
    role,
    onAct,
}: {
    role: DashboardRoleId;
    onAct?: (label: string) => void;
}) {
    const acts = THRIVE_DASH.quickActions[role] || [];
    return (
        <>
            {acts.map((a) => (
                <Button
                    key={a.label}
                    variant={a.primary ? "primary" : "secondary"}
                    size="md"
                    icon={
                        <Icon
                            name={a.icon}
                            size={17}
                            color={a.primary ? "#fff" : "var(--indigo-700)"}
                        />
                    }
                    onClick={() => onAct?.(a.label)}
                >
                    {a.label}
                </Button>
            ))}
        </>
    );
}

export function KpiRow({
    children,
    cols = 4,
}: {
    children: React.ReactNode;
    cols?: number | string;
}) {
    const tmpl = typeof cols === "number" ? `repeat(${cols}, 1fr)` : cols;
    return (
        <div style={{ display: "grid", gridTemplateColumns: tmpl, gap: 16 }}>
            {children}
        </div>
    );
}

export function Grid({
    children,
    cols = "1fr 1fr",
    gap = 16,
    style,
}: {
    children: React.ReactNode;
    cols?: string;
    gap?: number;
    style?: React.CSSProperties;
}) {
    return (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap, ...style }}>
            {children}
        </div>
    );
}

export function DrillRow({
    children,
    onClick,
    style,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    style?: React.CSSProperties;
}) {
    return (
        <div
            onClick={onClick}
            role="button"
            tabIndex={0}
            style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "13px 16px",
                cursor: "pointer",
                borderRadius: "var(--radius-md)",
                transition: "background .12s",
                ...style,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--slate-50)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
            }}
        >
            {children}
            <Icon
                name="ChevronRight"
                size={18}
                color="var(--slate-300)"
                style={{ flex: "none" }}
            />
        </div>
    );
}

export function ListStack({ rows }: { rows: React.ReactNode[] }) {
    return (
        <div>
            {rows.map((r, i) => (
                <div
                    key={i}
                    style={{ borderTop: i ? "1px solid var(--slate-200)" : "none" }}
                >
                    {r}
                </div>
            ))}
        </div>
    );
}

export function SLABadge({
    time,
    tone = "green",
}: {
    time: string;
    tone?: RagStatus;
}) {
    const c = {
        green: "var(--slate-500)",
        amber: "var(--amber-600)",
        red: "var(--red-600)",
    }[tone];
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                fontWeight: 600,
                color: c,
                fontFeatureSettings: '"tnum" 1',
                whiteSpace: "nowrap",
            }}
        >
            <Icon name="Clock" size={13} color={c} /> {time}
        </span>
    );
}

export function SessionPill({ status }: { status: "done" | "now" | "upcoming" }) {
    const map = {
        done: ["var(--green-fill)", "var(--green-600)", "Logged"],
        now: ["var(--indigo-50)", "var(--indigo-700)", "In progress"],
        upcoming: ["var(--slate-100)", "var(--slate-500)", "Upcoming"],
    }[status];
    return (
        <span
            style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "var(--radius-pill)",
                background: map[0],
                color: map[1],
                whiteSpace: "nowrap",
            }}
        >
            {map[2]}
        </span>
    );
}

export function DeptRagRow({
    short,
    name,
    rag,
    coverage,
    onClick,
}: {
    short: string;
    name: string;
    rag: RagCounts;
    coverage: number;
    onClick?: () => void;
}) {
    return (
        <DrillRow onClick={onClick} style={{ padding: "12px 16px" }}>
            <div style={{ width: 64, flex: "none" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--slate-800)" }}>
                    {short}
                </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontSize: 13,
                        color: "var(--slate-600)",
                        marginBottom: 6,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {name}
                </div>
                <RAGBar data={rag} height={8} showLegend={false} />
            </div>
            <div style={{ width: 56, textAlign: "right", flex: "none" }}>
                <div
                    style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--slate-800)",
                        fontFeatureSettings: '"tnum" 1',
                    }}
                >
                    {coverage}%
                </div>
                <div style={{ fontSize: 11, color: "var(--slate-400)" }}>coverage</div>
            </div>
        </DrillRow>
    );
}

export function CardLabel({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: React.CSSProperties;
}) {
    return (
        <div
            style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".04em",
                color: "var(--slate-400)",
                marginBottom: 12,
                ...style,
            }}
        >
            {children}
        </div>
    );
}

export function EmptyBlock({
    icon = "Inbox",
    title,
    desc,
}: {
    icon?: string;
    title: string;
    desc?: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "48px 24px",
                color: "var(--slate-400)",
            }}
        >
            <div
                style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "var(--slate-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 16,
                }}
            >
                <Icon name={icon} size={26} color="var(--slate-400)" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "var(--slate-600)" }}>
                {title}
            </div>
            {desc && (
                <div
                    style={{
                        fontSize: 13,
                        color: "var(--slate-400)",
                        marginTop: 6,
                        maxWidth: 320,
                        lineHeight: 1.5,
                    }}
                >
                    {desc}
                </div>
            )}
        </div>
    );
}

export function LabelBar({
    label,
    value,
    max = 100,
    right,
    color = "var(--indigo-700)",
}: {
    label: string;
    value: number;
    max?: number;
    right: string;
    color?: string;
}) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    return (
        <div style={{ marginBottom: 14 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: 6,
                }}
            >
                <span style={{ fontSize: 13, color: "var(--slate-700)" }}>{label}</span>
                <span
                    style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--slate-500)",
                        fontFeatureSettings: '"tnum" 1',
                    }}
                >
                    {right}
                </span>
            </div>
            <div
                style={{
                    width: "100%",
                    height: 8,
                    borderRadius: "var(--radius-pill)",
                    background: "var(--slate-100)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: color,
                        borderRadius: "var(--radius-pill)",
                    }}
                />
            </div>
        </div>
    );
}
