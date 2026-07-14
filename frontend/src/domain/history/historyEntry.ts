import type { CycleKind } from "../cycles/cycleSequence";

export type HistoryStatus = "completed" | "interrupted";

export type HistoryEntry = {
    id: string;
    taskName: string;
    kind: CycleKind;
    startedAt: number;
    completedAt: number;
    duration: number;
    status: HistoryStatus;
};

export type NewHistoryEntry = Omit<HistoryEntry, "id">;

function newId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createHistoryEntry(entry: NewHistoryEntry): HistoryEntry {
    return { id: newId(), ...entry };
}

function isHistoryEntry(raw: unknown): raw is HistoryEntry {
    if (raw === null || typeof raw !== "object") return false;
    const e = raw as Record<string, unknown>;
    return (
        typeof e.id === "string" &&
        typeof e.taskName === "string" &&
        (e.kind === "focus" || e.kind === "prayer") &&
        typeof e.startedAt === "number" &&
        typeof e.completedAt === "number" &&
        typeof e.duration === "number" &&
        (e.status === "completed" || e.status === "interrupted")
    );
}

export function parseHistory(raw: unknown): HistoryEntry[] {
    if (!Array.isArray(raw)) return [];
    return raw.filter(isHistoryEntry);
}
