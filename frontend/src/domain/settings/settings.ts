export const MINUTE_MS = 60_000;

export const MIN_DURATION_MINUTES = 1;
export const MAX_DURATION_MINUTES = 120;

export type Settings = {
    focusDuration: number;
    prayerDuration: number;
};

export const DEFAULT_SETTINGS: Settings = {
    focusDuration: 25 * MINUTE_MS,
    prayerDuration: 5 * MINUTE_MS,
};

export function clampDurationMinutes(minutes: number): number {
    if (!Number.isFinite(minutes)) return MIN_DURATION_MINUTES;
    return Math.min(
        MAX_DURATION_MINUTES,
        Math.max(MIN_DURATION_MINUTES, Math.round(minutes)),
    );
}

function readDuration(raw: unknown, fallback: number): number {
    if (typeof raw !== "number" || !Number.isFinite(raw)) return fallback;
    return clampDurationMinutes(raw / MINUTE_MS) * MINUTE_MS;
}

/**
 * O que vem do storage é `unknown`: dados antigos ou corrompidos precisam
 * degradar para os defaults em vez de virar NaN dentro do timer.
 */
export function parseSettings(raw: unknown): Settings {
    if (raw === null || typeof raw !== "object") return DEFAULT_SETTINGS;

    const candidate = raw as Partial<Record<keyof Settings, unknown>>;

    return {
        focusDuration: readDuration(
            candidate.focusDuration,
            DEFAULT_SETTINGS.focusDuration,
        ),
        prayerDuration: readDuration(
            candidate.prayerDuration,
            DEFAULT_SETTINGS.prayerDuration,
        ),
    };
}
