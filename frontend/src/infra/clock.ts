type Listener = () => void;

const TICK_MS = 250;

const listeners = new Set<Listener>();
let now = Date.now();
let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * O relógio é uma fonte externa ao React, então vive fora dele. O snapshot é
 * cacheado (só muda no tick) porque `useSyncExternalStore` exige um valor
 * estável entre chamadas do mesmo render.
 */
export function subscribeToClock(listener: Listener): () => void {
    listeners.add(listener);

    if (intervalId === null) {
        now = Date.now();
        intervalId = setInterval(() => {
            now = Date.now();
            for (const l of listeners) l();
        }, TICK_MS);
    }

    return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };
}

export function getClockSnapshot(): number {
    return now;
}
