import type { Settings } from "../settings/settings";

export type CycleKind = "focus" | "prayer";

/** `cycleNumber` é 1-based: ímpares são foco, pares são reza. */
export function cycleKindAt(cycleNumber: number): CycleKind {
    return cycleNumber % 2 === 1 ? "focus" : "prayer";
}

export function durationFor(kind: CycleKind, settings: Settings): number {
    return kind === "focus" ? settings.focusDuration : settings.prayerDuration;
}

/** Rezas concluídas antes do ciclo informado — indexa a dezena do terço. */
export function prayersCompletedBefore(cycleNumber: number): number {
    return Math.floor((cycleNumber - 1) / 2);
}
