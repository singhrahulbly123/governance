type IconName = "books" | "calendar" | "chevron" | "dashboard" | "departments" | "people" | "programs" | "settings" | "shield";

const paths: Record<IconName, React.ReactNode> = {
    books: <><path d="M5 4.75A2.75 2.75 0 0 1 7.75 2H19v16H7.75A2.75 2.75 0 0 0 5 20.75V4.75Z" /><path d="M5 5v16.75A2.25 2.25 0 0 1 7.25 19.5H19" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    departments: <><path d="M4 21V5l8-3 8 3v16" /><path d="M9 21v-5h6v5M8 8h.01M12 8h.01M16 8h.01M8 12h.01M12 12h.01M16 12h.01" /></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    programs: <><path d="M4 19.5V5.75A2.75 2.75 0 0 1 6.75 3H20v15H6.75A2.75 2.75 0 0 0 4 20.75" /><path d="M8 7h8M8 11h8" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-2.12 2.12-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V20.2h-3v-.08A1.65 1.65 0 0 0 10.8 18.6a1.65 1.65 0 0 0-1.82.33l-.06.06L6.8 16.87l.06-.06A1.65 1.65 0 0 0 7.2 15a1.65 1.65 0 0 0-1.51-1H5.6v-3h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06L8.93 6l.06.06A1.65 1.65 0 0 0 10.8 6.4h.01a1.65 1.65 0 0 0 1-1.51V4.8h3v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33L17.7 6l2.12 2.12-.06.06A1.65 1.65 0 0 0 19.4 10v.01a1.65 1.65 0 0 0 1.51 1h.09v3h-.09a1.65 1.65 0 0 0-1.51 1Z" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
    return <svg aria-hidden="true" className="shrink-0" fill="none" height={size} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24" width={size}>{paths[name]}</svg>;
}
