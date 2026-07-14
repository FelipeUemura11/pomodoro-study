import { cycleKindAt, durationFor, type CycleKind } from "../cycles/cycleSequence";
import type { HistoryStatus, NewHistoryEntry } from "../history/historyEntry";
import type { Settings } from "../settings/settings";

type CycleBase = {
    cycleNumber: number;
    taskName: string;
    duration: number;
    /** Início do ciclo, para o histórico. Não se move ao pausar. */
    startedAt: number;
    /** Tempo já corrido antes do trecho em execução atual. */
    accumulatedMs: number;
};

/**
 * `runningSince` só existe em `running`, o que torna "pausado e rodando ao
 * mesmo tempo" impossível de representar.
 */
export type TimerState =
    | { status: "idle" }
    | { status: "running"; cycle: CycleBase & { runningSince: number } }
    | { status: "paused"; cycle: CycleBase };

export type TimerAction =
    | { type: "START"; taskName: string; now: number }
    | { type: "PAUSE"; now: number }
    | { type: "RESUME"; now: number }
    | { type: "RESET"; now: number }
    | { type: "SKIP"; now: number }
    | { type: "COMPLETE"; now: number };

export type TimerEffect =
    | { type: "playAlarm" }
    | { type: "cycleEnded"; entry: NewHistoryEntry };

export type TimerResult = { state: TimerState; effects: TimerEffect[] };

export const IDLE: TimerState = { status: "idle" };

export function elapsedMs(state: TimerState, now: number): number {
    if (state.status === "idle") return 0;
    const current =
        state.status === "running"
            ? Math.max(0, now - state.cycle.runningSince)
            : 0;
    return state.cycle.accumulatedMs + current;
}

/** O tempo restante é sempre derivado do relógio, nunca armazenado. */
export function remainingMs(state: TimerState, now: number): number {
    if (state.status === "idle") return 0;
    return Math.max(0, state.cycle.duration - elapsedMs(state, now));
}

export function currentKind(state: TimerState): CycleKind | null {
    if (state.status === "idle") return null;
    return cycleKindAt(state.cycle.cycleNumber);
}

function isCycleBase(raw: unknown): raw is CycleBase {
    if (raw === null || typeof raw !== "object") return false;
    const c = raw as Record<string, unknown>;
    return (
        typeof c.cycleNumber === "number" &&
        c.cycleNumber >= 1 &&
        typeof c.taskName === "string" &&
        typeof c.duration === "number" &&
        typeof c.startedAt === "number" &&
        typeof c.accumulatedMs === "number"
    );
}

/**
 * Reidrata o timer após um reload. Como o estado guarda instantes absolutos e
 * não um contador, o ciclo retoma exatamente de onde estava.
 */
export function parseTimerState(raw: unknown): TimerState {
    if (raw === null || typeof raw !== "object") return IDLE;
    const s = raw as Record<string, unknown>;

    if (s.status === "running" && isCycleBase(s.cycle)) {
        const runningSince = (s.cycle as Record<string, unknown>).runningSince;
        if (typeof runningSince === "number") {
            return { status: "running", cycle: { ...s.cycle, runningSince } };
        }
    }

    if (s.status === "paused" && isCycleBase(s.cycle)) {
        return { status: "paused", cycle: s.cycle };
    }

    return IDLE;
}

function startCycle(
    cycleNumber: number,
    taskName: string,
    now: number,
    settings: Settings,
): TimerState {
    return {
        status: "running",
        cycle: {
            cycleNumber,
            taskName,
            duration: durationFor(cycleKindAt(cycleNumber), settings),
            startedAt: now,
            accumulatedMs: 0,
            runningSince: now,
        },
    };
}

function entryFor(
    state: Exclude<TimerState, { status: "idle" }>,
    now: number,
    status: HistoryStatus,
): NewHistoryEntry {
    return {
        taskName: state.cycle.taskName,
        kind: cycleKindAt(state.cycle.cycleNumber),
        startedAt: state.cycle.startedAt,
        completedAt: now,
        duration: Math.min(elapsedMs(state, now), state.cycle.duration),
        status,
    };
}

/**
 * Transição pura. Os efeitos são devolvidos, não executados: quem consome
 * decide como tocar o alarme e gravar o histórico.
 */
export function transition(
    state: TimerState,
    action: TimerAction,
    settings: Settings,
): TimerResult {
    switch (action.type) {
        case "START": {
            if (state.status !== "idle") return { state, effects: [] };
            return {
                state: startCycle(1, action.taskName, action.now, settings),
                effects: [],
            };
        }

        case "PAUSE": {
            if (state.status !== "running") return { state, effects: [] };
            const { cycle } = state;
            return {
                state: {
                    status: "paused",
                    cycle: {
                        cycleNumber: cycle.cycleNumber,
                        taskName: cycle.taskName,
                        duration: cycle.duration,
                        startedAt: cycle.startedAt,
                        accumulatedMs: elapsedMs(state, action.now),
                    },
                },
                effects: [],
            };
        }

        case "RESUME": {
            if (state.status !== "paused") return { state, effects: [] };
            return {
                state: {
                    status: "running",
                    cycle: { ...state.cycle, runningSince: action.now },
                },
                effects: [],
            };
        }

        case "RESET": {
            if (state.status === "idle") return { state, effects: [] };
            const effects: TimerEffect[] =
                elapsedMs(state, action.now) > 0
                    ? [
                          {
                              type: "cycleEnded",
                              entry: entryFor(state, action.now, "interrupted"),
                          },
                      ]
                    : [];
            return { state: IDLE, effects };
        }

        case "SKIP": {
            if (state.status === "idle") return { state, effects: [] };
            return {
                state: startCycle(
                    state.cycle.cycleNumber + 1,
                    state.cycle.taskName,
                    action.now,
                    settings,
                ),
                effects: [
                    {
                        type: "cycleEnded",
                        entry: entryFor(state, action.now, "interrupted"),
                    },
                ],
            };
        }

        case "COMPLETE": {
            if (state.status !== "running") return { state, effects: [] };
            if (remainingMs(state, action.now) > 0) return { state, effects: [] };
            return {
                state: startCycle(
                    state.cycle.cycleNumber + 1,
                    state.cycle.taskName,
                    action.now,
                    settings,
                ),
                effects: [
                    {
                        type: "cycleEnded",
                        entry: entryFor(state, action.now, "completed"),
                    },
                    { type: "playAlarm" },
                ],
            };
        }
    }
}
