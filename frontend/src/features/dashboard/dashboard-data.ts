export type RagStatus = "green" | "amber" | "red";

export type CalendarEventType =
    | "class"
    | "deadline"
    | "audit"
    | "workshop"
    | "visit";

export type CalendarDay = {
    day: string;
    date: number;
    events: {
        time: string;
        title: string;
        type: CalendarEventType;
        room?: string | null;
    }[];
};

export type RagCounts = {
    green: number;
    amber: number;
    red: number;
};

export type DashboardRoleId =
    | "faculty"
    | "visiting"
    | "program"
    | "hod"
    | "dean"
    | "academic"
    | "management"
    | "director";

export type RoleMeta = {
    id: DashboardRoleId;
    code: string;
    label: string;
    mobile?: boolean;
};

export const ROLES: RoleMeta[] = [
    { id: "faculty", code: "DASH-001", label: "Faculty", mobile: true },
    { id: "visiting", code: "DASH-002", label: "Visiting Faculty" },
    { id: "program", code: "DASH-003", label: "Program Leader" },
    { id: "hod", code: "DASH-004", label: "HoD — Command Center" },
    { id: "dean", code: "DASH-005", label: "Dean" },
    { id: "academic", code: "DASH-006", label: "Academic Head" },
    { id: "management", code: "DASH-007", label: "Management" },
    { id: "director", code: "DASH-008", label: "Director" },
];

export type RoleUser = {
    name: string;
    role: string;
    dept: string;
    deptId: string | null;
};

export type DepartmentRecord = {
    id: string;
    name: string;
    short: string;
    hod: string;
    faculty: number;
    coverage: number;
    audit: number;
    compliance: number;
    escalations: number;
    rag: RagCounts;
    trend: number[];
};

const institution = {
    name: "Sardar Patel Institute of Technology",
    short: "SPIT",
    term: "Odd Semester 2025–26",
    asOf: "Today, 08:42 IST",
};

const departments: DepartmentRecord[] = [
    {
        id: "cse",
        name: "Computer Science & Engineering",
        short: "CSE",
        hod: "Dr. Meera Iyer",
        faculty: 24,
        coverage: 84,
        audit: 88,
        compliance: 92,
        escalations: 1,
        rag: { green: 16, amber: 6, red: 2 },
        trend: [78, 80, 79, 82, 83, 84],
    },
    {
        id: "entc",
        name: "Electronics & Telecomm.",
        short: "EnTC",
        hod: "Dr. Rajesh Nair",
        faculty: 19,
        coverage: 76,
        audit: 81,
        compliance: 88,
        escalations: 2,
        rag: { green: 11, amber: 6, red: 2 },
        trend: [70, 72, 71, 73, 75, 76],
    },
    {
        id: "mech",
        name: "Mechanical Engineering",
        short: "MECH",
        hod: "Dr. S. Deshpande",
        faculty: 21,
        coverage: 63,
        audit: 71,
        compliance: 79,
        escalations: 4,
        rag: { green: 9, amber: 7, red: 5 },
        trend: [68, 66, 64, 63, 62, 63],
    },
    {
        id: "civil",
        name: "Civil Engineering",
        short: "CIVIL",
        hod: "Dr. A. Kulkarni",
        faculty: 16,
        coverage: 79,
        audit: 83,
        compliance: 90,
        escalations: 1,
        rag: { green: 11, amber: 4, red: 1 },
        trend: [74, 75, 77, 78, 78, 79],
    },
    {
        id: "it",
        name: "Information Technology",
        short: "IT",
        hod: "Dr. Priya Menon",
        faculty: 18,
        coverage: 88,
        audit: 90,
        compliance: 94,
        escalations: 0,
        rag: { green: 14, amber: 3, red: 1 },
        trend: [82, 84, 85, 86, 87, 88],
    },
    {
        id: "mba",
        name: "Management Studies",
        short: "MMS",
        hod: "Dr. V. Reddy",
        faculty: 12,
        coverage: 71,
        audit: 76,
        compliance: 85,
        escalations: 2,
        rag: { green: 7, amber: 4, red: 1 },
        trend: [69, 70, 68, 70, 71, 71],
    },
];

const instRag: RagCounts = departments.reduce(
    (a, d) => ({
        green: a.green + d.rag.green,
        amber: a.amber + d.rag.amber,
        red: a.red + d.rag.red,
    }),
    { green: 0, amber: 0, red: 0 }
);

const totalFaculty = departments.reduce((a, d) => a + d.faculty, 0);
const totalEscalations = departments.reduce((a, d) => a + d.escalations, 0);
const avgCoverage = Math.round(
    departments.reduce((a, d) => a + d.coverage, 0) / departments.length
);

const users: Record<DashboardRoleId, RoleUser> = {
    faculty: {
        name: "Dr. Kavya Sharma",
        role: "Assistant Professor",
        dept: "Computer Science & Engineering",
        deptId: "cse",
    },
    visiting: {
        name: "Prof. Arun Bhatia",
        role: "Visiting Faculty",
        dept: "Management Studies",
        deptId: "mba",
    },
    program: {
        name: "Dr. Neha Joshi",
        role: "Program Leader — B.Tech CSE",
        dept: "Computer Science & Engineering",
        deptId: "cse",
    },
    hod: {
        name: "Dr. Meera Iyer",
        role: "Head of Department",
        dept: "Computer Science & Engineering",
        deptId: "cse",
    },
    dean: {
        name: "Dr. Sunil Rao",
        role: "Dean, Academics",
        dept: "Institution-wide",
        deptId: null,
    },
    academic: {
        name: "Dr. Lata Krishnan",
        role: "Academic Head",
        dept: "Institution-wide",
        deptId: null,
    },
    management: {
        name: "Mr. R. Venkatesh",
        role: "Director — Operations",
        dept: "Institution-wide",
        deptId: null,
    },
    director: {
        name: "Dr. P. Ramaswamy",
        role: "Principal & Director",
        dept: "Institution-wide",
        deptId: null,
    },
};

const faculty = {
    sessions: [
        {
            time: "09:00",
            code: "CS-302",
            name: "Database Management Systems",
            room: "Lab 4 · Div A",
            status: "done" as const,
            logged: true,
        },
        {
            time: "11:15",
            code: "CS-408",
            name: "Machine Learning",
            room: "Room 214 · Div B",
            status: "now" as const,
            logged: false,
        },
        {
            time: "14:00",
            code: "CS-302",
            name: "DBMS — Tutorial",
            room: "Room 108 · Div A",
            status: "upcoming" as const,
            logged: false,
        },
        {
            time: "16:00",
            code: "CS-499",
            name: "Project Mentoring",
            room: "Project Lab",
            status: "upcoming" as const,
            logged: false,
        },
    ],
    subjects: [
        {
            code: "CS-302",
            name: "Database Management Systems",
            coverage: 78,
            sessions: "34 / 44",
            status: "green" as RagStatus,
        },
        {
            code: "CS-408",
            name: "Machine Learning",
            coverage: 61,
            sessions: "22 / 40",
            status: "amber" as RagStatus,
        },
        {
            code: "CS-499",
            name: "Major Project",
            coverage: 55,
            sessions: "11 / 20",
            status: "amber" as RagStatus,
        },
    ],
    plans: [
        {
            code: "CS-408",
            title: "Machine Learning — Unit 4 lesson plan",
            state: "Draft",
            due: "Due today",
            tone: "red" as RagStatus,
        },
        {
            code: "CS-302",
            title: "DBMS — Unit 5 lesson plan",
            state: "In review",
            due: "Due in 3 days",
            tone: "amber" as RagStatus,
        },
    ],
    kras: [
        {
            id: "K-118",
            title: "Course file completion — CS-302",
            status: "green" as RagStatus,
            owner: "Self",
            due: "On track",
        },
        {
            id: "K-124",
            title: "Improve ML lab coverage to 70%",
            status: "amber" as RagStatus,
            owner: "Self",
            due: "6 days left",
        },
    ],
    stats: { coverage: 68, sessionsWeek: 12, feedback: 4.4, plansPending: 2 },
};

const visiting = {
    confirmed: [
        {
            date: "Mon 14 Oct",
            time: "10:00–13:00",
            code: "MMS-Elective",
            name: "Industry Analytics Workshop",
            room: "Seminar Hall 2",
        },
        {
            date: "Thu 17 Oct",
            time: "14:00–16:00",
            code: "MMS-621",
            name: "Strategy Masterclass",
            room: "Room 301",
        },
    ],
    awaiting: [
        {
            date: "Tue 22 Oct",
            time: "11:00–13:00",
            code: "MMS-Elective",
            name: "Fintech Guest Lecture",
            room: "Seminar Hall 1",
            requested: "2 days ago",
        },
        {
            date: "Fri 25 Oct",
            time: "09:00–11:00",
            code: "MMS-540",
            name: "Case Study Panel",
            room: "Room 305",
            requested: "5 hours ago",
        },
    ],
    cotaught: [
        { code: "MMS-621", name: "Business Strategy", lead: "Dr. V. Reddy", mySessions: 4 },
        { code: "MMS-Elective", name: "Applied Analytics", lead: "Dr. S. Pillai", mySessions: 6 },
    ],
};

const program = {
    workload: [
        { name: "Dr. K. Sharma", load: 18, cap: 18, status: "green" as RagStatus },
        { name: "Dr. A. Bose", load: 22, cap: 18, status: "red" as RagStatus },
        { name: "Dr. N. Shah", load: 16, cap: 18, status: "green" as RagStatus },
        { name: "Dr. T. Rao", load: 20, cap: 18, status: "amber" as RagStatus },
        { name: "Dr. J. Pinto", load: 12, cap: 18, status: "green" as RagStatus },
    ],
    unassigned: [
        { code: "CS-506", name: "Cloud Computing (Elective)", div: "Div B", hrs: 4 },
        { code: "CS-512", name: "NLP (Elective)", div: "Div A", hrs: 3 },
    ],
    auditSections: [
        {
            id: "AUD-3.2",
            title: "Curriculum Delivery — CSE",
            status: "amber" as RagStatus,
            due: "4 days left",
        },
        {
            id: "AUD-3.5",
            title: "Continuous Assessment — CSE",
            status: "green" as RagStatus,
            due: "Compiled",
        },
        {
            id: "AUD-4.1",
            title: "Faculty Development — CSE",
            status: "red" as RagStatus,
            due: "Overdue 1 day",
        },
    ],
    coverage: 84,
};

const dept = departments[0];
const hod = {
    rag: dept.rag,
    coverage: dept.coverage,
    behind: [
        {
            name: "Dr. A. Bose",
            subject: "CS-404 Compiler Design",
            coverage: 48,
            gap: "−27 pts",
            status: "red" as RagStatus,
            due: "overdue",
        },
        {
            name: "Dr. T. Rao",
            subject: "CS-306 Operating Systems",
            coverage: 62,
            gap: "−13 pts",
            status: "amber" as RagStatus,
            due: "5d left",
        },
        {
            name: "Dr. Kavya Sharma",
            subject: "CS-408 Machine Learning",
            coverage: 61,
            gap: "−9 pts",
            status: "amber" as RagStatus,
            due: "6d left",
        },
    ],
    approvals: [
        {
            id: "A-3012",
            type: "Leave",
            who: "Dr. N. Shah",
            detail: "Casual leave · 16–17 Oct",
            sla: "4h",
            tone: "amber" as RagStatus,
        },
        {
            id: "A-3018",
            type: "Lesson plan",
            who: "Dr. J. Pinto",
            detail: "CS-210 Unit 3 revision",
            sla: "1d 6h",
            tone: "green" as RagStatus,
        },
        {
            id: "A-3021",
            type: "Guest session",
            who: "Dr. T. Rao",
            detail: "External speaker — Blockchain",
            sla: "2d",
            tone: "green" as RagStatus,
        },
    ],
    workshops: [
        { name: "AI/ML Faculty Bootcamp", progress: 80, target: "4 / 5 sessions" },
        { name: "Industry Masterclass Series", progress: 50, target: "3 / 6 sessions" },
    ],
    workloadFlag: { over: 3, balanced: 18, under: 3 },
    kraDetail: {
        id: "K-CSE-07",
        title: "Raise CS-404 Compiler Design coverage to 75%",
        status: "amber" as RagStatus,
        faculty: "Dr. A. Bose",
        current: 48,
        target: 75,
        plan: [
            {
                when: "02 Oct",
                text: "KRA flagged AMBER after mid-term coverage review",
                tone: "amber",
            },
            {
                when: "05 Oct",
                text: "Action plan created — 3 catch-up sessions scheduled",
                tone: "neutral",
            },
            {
                when: "11 Oct",
                text: "Coverage recalculated — now 48% (was 41%)",
                tone: "neutral",
            },
            { when: "—", text: "Next review at end of week", tone: "neutral" },
        ],
    },
    stats: {
        faculty: dept.faculty,
        onTrack: dept.rag.green,
        coverage: dept.coverage,
        pendingApprovals: 3,
    },
};

const dean = {
    deptRag: departments.map((d) => ({
        short: d.short,
        name: d.name,
        rag: d.rag,
        coverage: d.coverage,
    })),
    escalations: [
        {
            id: "ESC-204",
            dept: "MECH",
            title: "Compiler-lab safety audit lapse",
            raised: "3 days ago",
            status: "red" as RagStatus,
            owner: "Dr. S. Deshpande",
        },
        {
            id: "ESC-207",
            dept: "MECH",
            title: "CS-404 coverage below 50% at mid-term",
            raised: "1 day ago",
            status: "red" as RagStatus,
            owner: "Dr. A. Kulkarni",
        },
        {
            id: "ESC-211",
            dept: "EnTC",
            title: "Two faculty audits unsubmitted",
            raised: "6 hours ago",
            status: "red" as RagStatus,
            owner: "Dr. Rajesh Nair",
        },
    ],
    approvals: [
        {
            id: "A-5001",
            type: "RAG override",
            who: "MECH · Dr. S. Deshpande",
            detail: "Dispute AMBER → GREEN, CS-306",
            sla: "1d",
            tone: "amber" as RagStatus,
        },
        {
            id: "A-5004",
            type: "Escalation sign-off",
            who: "EnTC · Dr. Rajesh Nair",
            detail: "Remediation plan ESC-211",
            sla: "3h",
            tone: "red" as RagStatus,
        },
    ],
    goals: [
        { title: "Institution syllabus coverage ≥ 80%", value: avgCoverage, target: 80 },
        {
            title: "Zero RED KRAs by term close",
            value: 100 - Math.round(((instRag.red / totalFaculty) * 100) / 0.15),
            target: 100,
            display: `${instRag.red} open`,
        },
        { title: "Accreditation readiness ≥ 90%", value: 88, target: 90 },
        { title: "Faculty feedback avg ≥ 4.2", value: 86, target: 100, display: "4.3 / 5" },
    ],
    stats: {
        depts: departments.length,
        coverage: avgCoverage,
        redEsc: totalEscalations,
        faculty: totalFaculty,
    },
};

const academic = {
    qualityTrend: [79, 80, 78, 81, 83, 84, 85, 86],
    performance: [
        { band: "Exemplary (4.5+)", count: 34, pct: 28 },
        { band: "Strong (4.0–4.4)", count: 52, pct: 43 },
        { band: "Developing (3.5–3.9)", count: 26, pct: 22 },
        { band: "Needs support (<3.5)", count: 8, pct: 7 },
    ],
    readiness: [
        { body: "NBA (Tier-1)", pct: 91, status: "green" as RagStatus },
        { body: "NAAC", pct: 88, status: "amber" as RagStatus },
        { body: "NIRF submission", pct: 74, status: "amber" as RagStatus },
        { body: "AICTE compliance", pct: 96, status: "green" as RagStatus },
    ],
    stats: { quality: 86, avgFeedback: 4.3, curriculum: 88, redFaculty: 8 },
};

const management = {
    comparison: departments.map((d) => ({
        short: d.short,
        name: d.name,
        coverage: d.coverage,
        audit: d.audit,
        feedback: (3.8 + (d.audit - 70) * 0.02).toFixed(1),
        escalations: d.escalations,
    })),
    industry: [
        { label: "MoUs signed (YTD)", value: 14, trend: "up" as const, delta: "+3" },
        { label: "Guest sessions delivered", value: 62, trend: "up" as const, delta: "+11" },
        { label: "Live industry projects", value: 28, trend: "flat" as const, delta: "0" },
        { label: "Placement-linked workshops", value: 19, trend: "up" as const, delta: "+5" },
    ],
    readiness: 84,
    stats: {
        depts: departments.length,
        avgAudit: Math.round(
            departments.reduce((a, d) => a + d.audit, 0) / departments.length
        ),
        industry: 14,
        coverage: avgCoverage,
    },
};

const director = {
    scorecard: [
        {
            label: "Syllabus coverage",
            value: avgCoverage,
            unit: "%",
            status: (avgCoverage >= 80 ? "green" : "amber") as RagStatus,
        },
        {
            label: "Audit score (avg)",
            value: Math.round(
                departments.reduce((a, d) => a + d.audit, 0) / departments.length
            ),
            unit: "/100",
            status: "green" as RagStatus,
        },
        {
            label: "Accreditation readiness",
            value: 88,
            unit: "%",
            status: "amber" as RagStatus,
        },
        {
            label: "Open RED escalations",
            value: totalEscalations,
            unit: "",
            status: "red" as RagStatus,
        },
        {
            label: "Faculty on track",
            value: Math.round((instRag.green / totalFaculty) * 100),
            unit: "%",
            status: "green" as RagStatus,
        },
        { label: "Student feedback", value: 4.3, unit: "/5", status: "green" as RagStatus },
    ],
    escalationTrend: [6, 8, 7, 11, 9, 12, 10, 10],
    kpis: [
        { label: "Total faculty", value: totalFaculty },
        { label: "Active programs", value: 11 },
        { label: "Departments", value: departments.length },
        { label: "Students enrolled", value: "4,280" },
    ],
};

export type NotificationPreview = {
    id: string;
    urgency: "high" | "medium" | "low";
    module: string;
    title: string;
    when: string;
    read: boolean;
    rag: RagStatus;
};

const notifications: NotificationPreview[] = [
    {
        id: "n1",
        urgency: "high",
        module: "KRA",
        title: "RED escalation: MECH compiler-lab safety audit lapse",
        when: "18m ago",
        read: false,
        rag: "red",
    },
    {
        id: "n2",
        urgency: "high",
        module: "Audit",
        title: "EnTC — two faculty audits unsubmitted past deadline",
        when: "2h ago",
        read: false,
        rag: "red",
    },
    {
        id: "n3",
        urgency: "medium",
        module: "Approvals",
        title: "Leave request from Dr. N. Shah awaiting your approval",
        when: "4h ago",
        read: false,
        rag: "amber",
    },
    {
        id: "n4",
        urgency: "low",
        module: "Coverage",
        title: "CSE department coverage crossed 84%",
        when: "Yesterday",
        read: true,
        rag: "green",
    },
];

const quickActions: Record<
    DashboardRoleId,
    { icon: string; label: string; primary?: boolean }[]
> = {
    faculty: [
        { icon: "ClipboardCheck", label: "Log a Class", primary: true },
        { icon: "FileText", label: "Submit Lesson Plan" },
    ],
    visiting: [
        { icon: "CalendarCheck", label: "Confirm Session", primary: true },
        { icon: "CalendarX", label: "Decline Session" },
    ],
    program: [
        { icon: "FolderCheck", label: "Compile Audit Section", primary: true },
        { icon: "Flag", label: "Flag Workload Gap" },
    ],
    hod: [
        { icon: "CircleDot", label: "Set RAG Status", primary: true },
        { icon: "CheckCheck", label: "Approve Pending Item" },
    ],
    dean: [
        { icon: "AlertOctagon", label: "Review RED Escalations", primary: true },
        { icon: "ShieldCheck", label: "Override RAG" },
    ],
    academic: [{ icon: "Download", label: "Export Quality Report", primary: true }],
    management: [{ icon: "Download", label: "Export Performance Report", primary: true }],
    director: [{ icon: "Download", label: "Export Scorecard", primary: true }],
};

export const THRIVE_DASH = {
    institution,
    departments,
    users,
    instRag,
    totalFaculty,
    totalEscalations,
    avgCoverage,
    faculty,
    visiting,
    program,
    hod,
    dean,
    academic,
    management,
    director,
    notifications,
    quickActions,
};

// ---- Shared Utility Layer Data (DASH-009..015) ----
export const THRIVE_UTIL = {
    health: {
        escalationTrend: [6, 8, 7, 11, 9, 12, 10, 10],
        complianceBodies: ["NBA", "NAAC", "NIRF", "AICTE"] as const,
        departments: departments.map((dp) => ({
            ...dp,
            compliance: {
                NBA: dp.compliance,
                NAAC: Math.max(60, dp.compliance - 6),
                NIRF: Math.max(55, dp.compliance - 14),
                AICTE: Math.min(99, dp.compliance + 4),
            },
            escRate: ((dp.escalations / dp.faculty) * 100).toFixed(1),
        })),
    },
    notifications: [
        {
            id: "n1",
            urgency: "high" as const,
            module: "KRA",
            title: "RED escalation — MECH compiler-lab safety audit lapse",
            source: "ESC-204",
            when: "18 min ago",
            read: false,
            rag: "red" as RagStatus,
        },
        {
            id: "n2",
            urgency: "high" as const,
            module: "Audit",
            title: "EnTC — two faculty audits unsubmitted past deadline",
            source: "AUD-EnTC-11",
            when: "2 hours ago",
            read: false,
            rag: "red" as RagStatus,
        },
        {
            id: "n3",
            urgency: "medium" as const,
            module: "Approvals",
            title: "Leave request from Dr. N. Shah awaiting your approval",
            source: "A-3012",
            when: "4 hours ago",
            read: false,
            rag: "amber" as RagStatus,
        },
        {
            id: "n4",
            urgency: "medium" as const,
            module: "KRA",
            title: "CS-404 Compiler Design coverage recalculated — now 48%",
            source: "K-CSE-07",
            when: "6 hours ago",
            read: false,
            rag: "amber" as RagStatus,
        },
        {
            id: "n5",
            urgency: "low" as const,
            module: "Coverage",
            title: "CSE department coverage crossed 84%",
            source: "DEPT-cse",
            when: "Yesterday, 16:20",
            read: true,
            rag: "green" as RagStatus,
        },
        {
            id: "n6",
            urgency: "low" as const,
            module: "Workshop",
            title: "AI/ML Faculty Bootcamp — session 4 of 5 logged",
            source: "WS-021",
            when: "Yesterday, 11:05",
            read: true,
            rag: "green" as RagStatus,
        },
        {
            id: "n7",
            urgency: "low" as const,
            module: "Feedback",
            title: "Mid-term feedback window opens Monday",
            source: "FB-Q3",
            when: "2 days ago",
            read: true,
            rag: "green" as RagStatus,
        },
    ],
    calendar: {
        week: "Mon 14 – Sun 20 Oct 2025",
        days: [
            {
                day: "Mon",
                date: 14,
                events: [
                    { time: "09:00", title: "CS-302 DBMS", type: "class" as const, room: "Lab 4" },
                    {
                        time: "11:15",
                        title: "CS-408 Machine Learning",
                        type: "class" as const,
                        room: "Room 214",
                    },
                    {
                        time: "15:00",
                        title: "AI/ML Bootcamp — S4",
                        type: "workshop" as const,
                        room: "Seminar Hall 2",
                    },
                ],
            },
            {
                day: "Tue",
                date: 15,
                events: [
                    {
                        time: "10:00",
                        title: "CS-302 Tutorial",
                        type: "class" as const,
                        room: "Room 108",
                    },
                    {
                        time: "17:00",
                        title: "Lesson plan due — CS-408",
                        type: "deadline" as const,
                        room: "",
                    },
                ],
            },
            {
                day: "Wed",
                date: 16,
                events: [
                    {
                        time: "09:00",
                        title: "CS-408 ML Lab",
                        type: "class" as const,
                        room: "Lab 2",
                    },
                    {
                        time: "14:00",
                        title: "NBA site visit prep",
                        type: "visit" as const,
                        room: "Conf. Room",
                    },
                ],
            },
            {
                day: "Thu",
                date: 17,
                events: [
                    {
                        time: "11:15",
                        title: "CS-499 Project Mentoring",
                        type: "class" as const,
                        room: "Project Lab",
                    },
                    {
                        time: "16:00",
                        title: "Dept review meeting",
                        type: "workshop" as const,
                        room: "HoD Office",
                    },
                ],
            },
            {
                day: "Fri",
                date: 18,
                events: [
                    { time: "09:00", title: "CS-302 DBMS", type: "class" as const, room: "Lab 4" },
                    {
                        time: "13:00",
                        title: "Audit AUD-3.2 due",
                        type: "deadline" as const,
                        room: "",
                    },
                ],
            },
            { day: "Sat", date: 19, events: [] },
            { day: "Sun", date: 20, events: [] },
        ] as CalendarDay[],
        types: {
            class: ["Class", "var(--indigo-700)"],
            workshop: ["Workshop / meeting", "var(--gold-700)"],
            deadline: ["Deadline", "var(--red-600)"],
            audit: ["Audit", "var(--gold-700)"],
            visit: ["Site visit", "var(--green-600)"],
        } as const,
    },
    tasks: [
        {
            id: "t1",
            title: "Submit Machine Learning Unit-4 lesson plan",
            ctx: "CS-408 · flagged by PLN-LSN-02",
            group: "overdue" as const,
            due: "Overdue by 1 day",
            to: "Lesson Plan Builder",
        },
        {
            id: "t2",
            title: "Log attendance for CS-302 (Mon session)",
            ctx: "CS-302 · unlogged class",
            group: "today" as const,
            due: "Due today",
            to: "Class Logging",
        },
        {
            id: "t3",
            title: "Confirm mid-term feedback collection",
            ctx: "CS-408 · KRA K-124",
            group: "today" as const,
            due: "Due today",
            to: "KRA Detail",
        },
        {
            id: "t4",
            title: "Upload DBMS Unit-5 lesson plan for review",
            ctx: "CS-302",
            group: "week" as const,
            due: "Due in 3 days",
            to: "Lesson Plan Builder",
        },
        {
            id: "t5",
            title: "Complete course file — CS-302",
            ctx: "KRA K-118",
            group: "week" as const,
            due: "Due in 5 days",
            to: "KRA Detail",
        },
    ],
    approvals: {
        pending: [
            {
                id: "A-3012",
                type: "Leave",
                who: "Dr. N. Shah",
                detail: "Casual leave · 16–17 Oct",
                sla: "4h left",
                tone: "amber" as RagStatus,
                to: "Faculty submission",
            },
            {
                id: "A-3018",
                type: "Lesson plan",
                who: "Dr. J. Pinto",
                detail: "CS-210 Unit 3 revision",
                sla: "1d 6h left",
                tone: "green" as RagStatus,
                to: "Lesson Plan",
            },
            {
                id: "A-3021",
                type: "Guest session",
                who: "Dr. T. Rao",
                detail: "External speaker — Blockchain",
                sla: "2d left",
                tone: "green" as RagStatus,
                to: "Workshop Session",
            },
            {
                id: "A-3009",
                type: "Audit section",
                who: "Dr. A. Bose",
                detail: "AUD-4.1 Faculty Development",
                sla: "SLA lapsed",
                tone: "red" as RagStatus,
                to: "Audit Instance",
            },
        ],
        history: [
            {
                id: "A-2990",
                type: "Leave",
                who: "Dr. K. Sharma",
                decision: "Approved" as const,
                when: "11 Oct",
                reason: "",
            },
            {
                id: "A-2984",
                type: "Lesson plan",
                who: "Dr. T. Rao",
                decision: "Rejected" as const,
                when: "10 Oct",
                reason: "Unit mapping incomplete — resubmit with CO/PO tags.",
            },
            {
                id: "A-2977",
                type: "Guest session",
                who: "Dr. J. Pinto",
                decision: "Approved" as const,
                when: "08 Oct",
                reason: "",
            },
        ],
    },
    activity: [
        {
            type: "class" as const,
            text: "Logged CS-302 DBMS session (Div A)",
            when: "Today, 09:52",
            to: "Class record",
        },
        {
            type: "plan" as const,
            text: "Submitted DBMS Unit-5 lesson plan for review",
            when: "Today, 08:40",
            to: "Lesson Plan",
        },
        {
            type: "kra" as const,
            text: "Updated action plan on KRA K-124 (ML lab coverage)",
            when: "Yesterday, 17:12",
            to: "KRA Detail",
        },
        {
            type: "feedback" as const,
            text: "Viewed student feedback summary — CS-302",
            when: "Yesterday, 14:30",
            to: "Feedback",
        },
        {
            type: "class" as const,
            text: "Logged CS-408 Machine Learning session",
            when: "11 Oct, 11:48",
            to: "Class record",
        },
        {
            type: "plan" as const,
            text: "Course file CS-302 marked complete",
            when: "10 Oct, 16:05",
            to: "Course file",
        },
    ],
    activityIcon: {
        class: "BookOpen",
        plan: "FileText",
        kra: "Target",
        feedback: "Star",
    } as const,
};
