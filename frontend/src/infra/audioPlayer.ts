const BEEP_COUNT = 3;
const BEEP_FREQUENCY = 880;
const BEEP_DURATION = 0.18;
const BEEP_GAP = 0.28;
const PEAK_GAIN = 0.25;

let context: AudioContext | null = null;

function ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!context) {
        try {
            context = new AudioContext();
        } catch {
            return null;
        }
    }
    return context;
}

/**
 * Navegadores só liberam áudio depois de um gesto do usuário. Precisa ser
 * chamado a partir do clique que inicia o ciclo — senão o alarme dos 25
 * minutos, que dispara sem gesto nenhum, simplesmente não sai.
 */
export function unlockAudio(): void {
    const ctx = ensureContext();
    if (ctx && ctx.state === "suspended") void ctx.resume();
}

function scheduleBeep(ctx: AudioContext, at: number): void {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = BEEP_FREQUENCY;

    // Rampa em vez de liga/desliga: um ganho quadrado estala no alto-falante.
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(PEAK_GAIN, at + 0.01);
    gain.gain.linearRampToValueAtTime(0, at + BEEP_DURATION);

    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(at);
    oscillator.stop(at + BEEP_DURATION);
}

export function playAlarm(): void {
    const ctx = ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") void ctx.resume();

    for (let i = 0; i < BEEP_COUNT; i++) {
        scheduleBeep(ctx, ctx.currentTime + i * BEEP_GAP);
    }
}
