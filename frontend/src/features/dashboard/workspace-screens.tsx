"use client";

import { useEffect, useState, type FormEvent, type CSSProperties } from "react";
import { apiRequest } from "@/services/api/client";
import {
    Badge,
    Button,
    ContentCard,
    EmptyBlock,
    Input,
    PageHeader,
} from "./dashboard-primitives";

type CalendarEvent = {
    id: number;
    title: string;
    description: string | null;
    event_type: string;
    starts_at: string;
    ends_at: string | null;
    is_all_day: boolean;
    location: string | null;
};

type Task = {
    id: number;
    title: string;
    description: string | null;
    due_at: string | null;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    priority: "low" | "normal" | "high";
};

type ActivityEntry = {
    id: number;
    event: string;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    created_at: string;
};

type ApiEnvelope<T> = { data: T };

const fieldStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "var(--slate-700)",
    fontSize: 13,
    fontWeight: 600,
};

const controlStyle: CSSProperties = {
    boxSizing: "border-box",
    width: "100%",
    minHeight: 40,
    border: "1px solid var(--slate-300)",
    borderRadius: "var(--radius-md)",
    background: "#fff",
    color: "var(--slate-800)",
    padding: "9px 12px",
    font: "inherit",
    fontWeight: 400,
};

function localDateTime(value?: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function displayDate(value?: string | null, options?: Intl.DateTimeFormatOptions): string {
    if (!value) return "No date set";
    return new Date(value).toLocaleString(undefined, options ?? {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

async function sendJson<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await apiRequest(path, options);
    const payload = response.status === 204
        ? null
        : await response.json().catch(() => null) as { message?: string } | T | null;

    if (!response.ok) {
        const message = payload && typeof payload === "object" && "message" in payload
            ? payload.message
            : "The request could not be completed.";
        throw new Error(message || "The request could not be completed.");
    }

    return payload as T;
}

async function loadCollection<T>(path: string): Promise<T[]> {
    const payload = await sendJson<ApiEnvelope<T[]>>(path);
    return Array.isArray(payload?.data) ? payload.data : [];
}

function ErrorNotice({ message }: { message: string }) {
    if (!message) return null;
    return (
        <div role="alert" style={{ color: "var(--red-600)", fontSize: 13, margin: "10px 0" }}>
            {message}
        </div>
    );
}

function WorkspacePage({
    title,
    subtitle,
    action,
    children,
}: {
    title: string;
    subtitle: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div style={{ padding: "28px 32px 48px", maxWidth: 1180, margin: "0 auto" }}>
            <PageHeader eyebrow="My workspace · Live records" title={title} sub={subtitle} actions={action} />
            {children}
        </div>
    );
}

type EventDraft = {
    title: string;
    description: string;
    event_type: string;
    starts_at: string;
    ends_at: string;
    is_all_day: boolean;
    location: string;
};

const emptyEvent: EventDraft = {
    title: "",
    description: "",
    event_type: "personal",
    starts_at: "",
    ends_at: "",
    is_all_day: false,
    location: "",
};

export function CalendarWorkspaceScreen() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [draft, setDraft] = useState<EventDraft>(emptyEvent);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function refreshEvents(): Promise<void> {
        setError("");
        try {
            setEvents(await loadCollection<CalendarEvent>("/api/v1/calendar-events"));
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not load calendar events.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;
        loadCollection<CalendarEvent>("/api/v1/calendar-events")
            .then((data) => { if (!cancelled) setEvents(data); })
            .catch((requestError: unknown) => {
                if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Could not load calendar events.");
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    function beginEdit(event: CalendarEvent): void {
        setDraft({
            title: event.title,
            description: event.description ?? "",
            event_type: event.event_type,
            starts_at: localDateTime(event.starts_at),
            ends_at: localDateTime(event.ends_at),
            is_all_day: event.is_all_day,
            location: event.location ?? "",
        });
        setEditingId(event.id);
        setIsFormOpen(true);
    }

    function beginCreate(): void {
        setDraft({ ...emptyEvent });
        setEditingId(null);
        setIsFormOpen(true);
    }

    async function submitEvent(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setSaving(true);
        setError("");
        const payload = {
            ...draft,
            starts_at: new Date(draft.starts_at).toISOString(),
            ends_at: draft.ends_at ? new Date(draft.ends_at).toISOString() : null,
        };

        try {
            const path = editingId === null
                ? "/api/v1/calendar-events"
                : `/api/v1/calendar-events/${editingId}`;
            await sendJson(path, {
                method: editingId === null ? "POST" : "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            setIsFormOpen(false);
            await refreshEvents();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not save this event.");
        } finally {
            setSaving(false);
        }
    }

    async function deleteEvent(event: CalendarEvent): Promise<void> {
        if (!window.confirm(`Delete “${event.title}”?`)) return;
        try {
            await sendJson(`/api/v1/calendar-events/${event.id}`, { method: "DELETE" });
            await refreshEvents();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not delete this event.");
        }
    }

    return (
        <WorkspacePage
            title="My Calendar"
            subtitle="Create and manage your own calendar events. Changes are saved to the account database."
            action={<Button onClick={beginCreate}>Add event</Button>}
        >
            <ErrorNotice message={error} />
            {isFormOpen && (
                <ContentCard title={editingId === null ? "New calendar event" : "Edit calendar event"} style={{ marginBottom: 18 }}>
                    <form onSubmit={submitEvent} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                        <label style={fieldStyle}>Title<Input required maxLength={180} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
                        <label style={fieldStyle}>Type<select style={controlStyle} value={draft.event_type} onChange={(e) => setDraft({ ...draft, event_type: e.target.value })}><option value="personal">Personal</option><option value="class">Class</option><option value="meeting">Meeting</option><option value="deadline">Deadline</option><option value="other">Other</option></select></label>
                        <label style={fieldStyle}>Starts<input required type="datetime-local" style={controlStyle} value={draft.starts_at} onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })} /></label>
                        <label style={fieldStyle}>Ends (optional)<input type="datetime-local" style={controlStyle} value={draft.ends_at} min={draft.starts_at || undefined} onChange={(e) => setDraft({ ...draft, ends_at: e.target.value })} /></label>
                        <label style={fieldStyle}>Location<input maxLength={180} style={controlStyle} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label>
                        <label style={{ ...fieldStyle, flexDirection: "row", alignItems: "center", alignSelf: "end", minHeight: 40 }}><input type="checkbox" checked={draft.is_all_day} onChange={(e) => setDraft({ ...draft, is_all_day: e.target.checked })} /> All day</label>
                        <label style={{ ...fieldStyle, gridColumn: "1 / -1" }}>Notes<textarea maxLength={5000} rows={3} style={controlStyle} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
                        <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 8 }}><Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button type="submit" loading={saving}>{editingId === null ? "Save event" : "Save changes"}</Button></div>
                    </form>
                </ContentCard>
            )}
            <ContentCard title="Upcoming and past events" action={<Badge>{events.length} saved</Badge>}>
                {loading ? <EmptyBlock icon="Clock" title="Loading calendar" desc="Reading your saved events…" /> : events.length === 0 ? <EmptyBlock icon="Calendar" title="Your calendar is empty" desc="Add an event to start building your personal calendar." /> : (
                    <div>
                        {events.map((event, index) => (
                            <div key={event.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderTop: index ? "1px solid var(--slate-100)" : "none" }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><strong style={{ color: "var(--slate-800)", fontSize: 14 }}>{event.title}</strong><Badge tone="brand">{event.event_type}</Badge>{event.is_all_day && <Badge>All day</Badge>}</div>
                                    <div style={{ color: "var(--slate-500)", fontSize: 12, marginTop: 5 }}>{displayDate(event.starts_at)}{event.ends_at ? ` – ${displayDate(event.ends_at)}` : ""}{event.location ? ` · ${event.location}` : ""}</div>
                                    {event.description && <div style={{ color: "var(--slate-600)", fontSize: 13, marginTop: 5 }}>{event.description}</div>}
                                </div>
                                <Button size="sm" variant="secondary" onClick={() => beginEdit(event)}>Edit</Button>
                                <Button size="sm" variant="danger" onClick={() => void deleteEvent(event)}>Delete</Button>
                            </div>
                        ))}
                    </div>
                )}
            </ContentCard>
        </WorkspacePage>
    );
}

type TaskDraft = { title: string; description: string; due_at: string; status: Task["status"]; priority: Task["priority"] };
const emptyTask: TaskDraft = { title: "", description: "", due_at: "", status: "pending", priority: "normal" };

export function TasksWorkspaceScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [draft, setDraft] = useState<TaskDraft>(emptyTask);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function refreshTasks(): Promise<void> {
        setError("");
        try {
            setTasks(await loadCollection<Task>("/api/v1/tasks"));
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not load tasks.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let cancelled = false;
        loadCollection<Task>("/api/v1/tasks")
            .then((data) => { if (!cancelled) setTasks(data); })
            .catch((requestError: unknown) => {
                if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Could not load tasks.");
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    function editTask(task: Task): void {
        setDraft({ title: task.title, description: task.description ?? "", due_at: localDateTime(task.due_at), status: task.status, priority: task.priority });
        setEditingId(task.id);
        setIsFormOpen(true);
    }

    async function saveTask(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setSaving(true);
        setError("");
        const payload = { ...draft, due_at: draft.due_at ? new Date(draft.due_at).toISOString() : null };
        try {
            const path = editingId === null ? "/api/v1/tasks" : `/api/v1/tasks/${editingId}`;
            await sendJson(path, { method: editingId === null ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            setIsFormOpen(false);
            await refreshTasks();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not save this task.");
        } finally {
            setSaving(false);
        }
    }

    async function updateTask(task: Task, changes: Partial<TaskDraft>): Promise<void> {
        setError("");
        try {
            await sendJson(`/api/v1/tasks/${task.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(changes) });
            await refreshTasks();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not update this task.");
        }
    }

    async function deleteTask(task: Task): Promise<void> {
        if (!window.confirm(`Delete “${task.title}”?`)) return;
        try {
            await sendJson(`/api/v1/tasks/${task.id}`, { method: "DELETE" });
            await refreshTasks();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : "Could not delete this task.");
        }
    }

    return (
        <WorkspacePage title="My Tasks" subtitle="Create tasks, set due dates, and update progress. Each change is saved and added to your activity timeline." action={<Button onClick={() => { setDraft({ ...emptyTask }); setEditingId(null); setIsFormOpen(true); }}>Add task</Button>}>
            <ErrorNotice message={error} />
            {isFormOpen && <ContentCard title={editingId === null ? "New task" : "Edit task"} style={{ marginBottom: 18 }}>
                <form onSubmit={saveTask} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                    <label style={fieldStyle}>Task title<Input required maxLength={180} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></label>
                    <label style={fieldStyle}>Due date<input type="datetime-local" style={controlStyle} value={draft.due_at} onChange={(e) => setDraft({ ...draft, due_at: e.target.value })} /></label>
                    <label style={fieldStyle}>Priority<select style={controlStyle} value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value as TaskDraft["priority"] })}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option></select></label>
                    <label style={fieldStyle}>Status<select style={controlStyle} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskDraft["status"] })}><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label>
                    <label style={{ ...fieldStyle, gridColumn: "1 / -1" }}>Details<textarea maxLength={5000} rows={3} style={controlStyle} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></label>
                    <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", gap: 8 }}><Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>Cancel</Button><Button type="submit" loading={saving}>{editingId === null ? "Save task" : "Save changes"}</Button></div>
                </form>
            </ContentCard>}
            <ContentCard title="Your task list" action={<Badge>{tasks.length} saved</Badge>}>
                {loading ? <EmptyBlock icon="Clock" title="Loading tasks" desc="Reading your saved tasks…" /> : tasks.length === 0 ? <EmptyBlock icon="ListChecks" title="No tasks yet" desc="Add a task and it will appear here with its status and due date." /> : <div>
                    {tasks.map((task, index) => <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderTop: index ? "1px solid var(--slate-100)" : "none" }}>
                        <div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><strong style={{ color: "var(--slate-800)", fontSize: 14 }}>{task.title}</strong><Badge tone={task.priority === "high" ? "red" : task.priority === "low" ? "neutral" : "brand"}>{task.priority}</Badge></div><div style={{ color: "var(--slate-500)", fontSize: 12, marginTop: 5 }}>{task.due_at ? `Due ${displayDate(task.due_at)}` : "No due date"}{task.description ? ` · ${task.description}` : ""}</div></div>
                        <select aria-label={`Status for ${task.title}`} style={{ ...controlStyle, width: 138 }} value={task.status} onChange={(e) => void updateTask(task, { status: e.target.value as Task["status"] })}><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
                        <Button size="sm" variant="secondary" onClick={() => editTask(task)}>Edit</Button><Button size="sm" variant="danger" onClick={() => void deleteTask(task)}>Delete</Button>
                    </div>)}
                </div>}
            </ContentCard>
        </WorkspacePage>
    );
}

export function ActivityTimelineScreen() {
    const [entries, setEntries] = useState<ActivityEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        loadCollection<ActivityEntry>("/api/v1/activity-timeline")
            .then((data) => { if (!cancelled) setEntries(data); })
            .catch((requestError: unknown) => {
                if (!cancelled) setError(requestError instanceof Error ? requestError.message : "Could not load your activity timeline.");
            })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    return (
        <WorkspacePage title="Activity Timeline" subtitle="A personal history of calendar and task changes, stored by the backend.">
            <ErrorNotice message={error} />
            <ContentCard title="Recent activity" action={<Badge>{entries.length} records</Badge>}>
                {loading ? <EmptyBlock icon="Clock" title="Loading activity" desc="Reading your recent actions…" /> : entries.length === 0 ? <EmptyBlock icon="History" title="No activity yet" desc="Creating or updating a calendar event or task will add an entry here." /> : <div>
                    {entries.map((entry, index) => <div key={entry.id} style={{ display: "flex", gap: 14, padding: "14px 20px", borderTop: index ? "1px solid var(--slate-100)" : "none" }}><span aria-hidden="true" style={{ width: 9, height: 9, marginTop: 6, flex: "none", borderRadius: "50%", background: "var(--indigo-700)" }} /><div><div style={{ color: "var(--slate-800)", fontSize: 14, fontWeight: 600 }}>{entry.description}</div><div style={{ color: "var(--slate-500)", fontSize: 12, marginTop: 4 }}>{displayDate(entry.created_at)}</div></div></div>)}
                </div>}
            </ContentCard>
        </WorkspacePage>
    );
}
