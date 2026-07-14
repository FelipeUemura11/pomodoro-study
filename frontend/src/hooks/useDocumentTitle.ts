import { useEffect } from "react";
import { currentKind, type TimerState } from "../domain/timer/timerMachine";
import { formatTime } from "../lib/formatTime";
import { useTimeRemaining } from "./useTimeRemaining";

const BASE_TITLE = "Pomodoro Study";

/** Mantém o tempo visível na aba do navegador enquanto o usuário está em outra. */
export function useDocumentTitle(state: TimerState): void {
    const remaining = useTimeRemaining(state);

    useEffect(() => {
        if (state.status === "idle") {
            document.title = BASE_TITLE;
            return;
        }

        const label = currentKind(state) === "focus" ? "Foco" : "Reza";
        const paused = state.status === "paused" ? " (pausado)" : "";
        document.title = `${formatTime(remaining)} · ${label}${paused}`;
    }, [state, remaining]);

    useEffect(() => () => void (document.title = BASE_TITLE), []);
}
