/**
 * Arredonda para cima: aos 25 minutos cheios o mostrador deve ler 25:00, e
 * 00:00 só deve aparecer quando o ciclo realmente acabou.
 */
export function formatTime(ms: number): string {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatMinutes(ms: number): string {
    const minutes = Math.round(ms / 60_000);
    return `${minutes} min`;
}

const dateTimeFormat = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
});

export function formatDateTime(epochMs: number): string {
    return dateTimeFormat.format(new Date(epochMs));
}
