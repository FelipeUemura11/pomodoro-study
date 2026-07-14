/**
 * Porta de persistência. Nenhum componente deve tocar `localStorage` direto:
 * trocar por uma API depois deve ser substituir o adapter, nada mais.
 */
export interface Storage {
    read(key: string): unknown;
    write(key: string, value: unknown): void;
}

export const StorageKeys = {
    settings: "pomodoro:settings",
    history: "pomodoro:history",
    theme: "pomodoro:theme",
    timer: "pomodoro:timer",
} as const;
