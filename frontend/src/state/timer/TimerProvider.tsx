import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    parseTimerState,
    remainingMs,
    transition,
    type TimerAction,
    type TimerState,
} from "../../domain/timer/timerMachine";
import { playAlarm, unlockAudio } from "../../infra/audioPlayer";
import { localStorageAdapter } from "../../infra/localStorageAdapter";
import { StorageKeys } from "../../ports/storage";
import { useHistory } from "../history/useHistory";
import { useSettings } from "../settings/useSettings";
import { TimerContext } from "./TimerContext";

export function TimerProvider({ children }: { children: ReactNode }) {
    const { settings } = useSettings();
    const { append } = useHistory();

    const [state, setState] = useState<TimerState>(() =>
        parseTimerState(localStorageAdapter.read(StorageKeys.timer)),
    );

    useEffect(() => {
        localStorageAdapter.write(StorageKeys.timer, state);
    }, [state]);

    /**
     * Os efeitos rodam aqui, no handler, e não dentro de um updater de setState:
     * o updater precisa ser puro (o StrictMode o invoca duas vezes) e tocaria o
     * alarme em dobro.
     */
    const dispatch = useCallback(
        (action: TimerAction) => {
            const { state: next, effects } = transition(state, action, settings);
            if (next !== state) setState(next);

            for (const effect of effects) {
                if (effect.type === "playAlarm") playAlarm();
                else append(effect.entry);
            }
        },
        [state, settings, append],
    );

    // Dispara COMPLETE no instante exato do fim do ciclo. Em aba de segundo
    // plano o disparo atrasa, mas o tempo exibido continua correto porque é
    // derivado do relógio, não deste temporizador.
    useEffect(() => {
        if (state.status !== "running") return;

        const id = setTimeout(
            () => dispatch({ type: "COMPLETE", now: Date.now() }),
            remainingMs(state, Date.now()),
        );
        return () => clearTimeout(id);
    }, [state, dispatch]);

    const start = useCallback(
        (taskName: string) => {
            // Precisa acontecer no gesto do usuário, senão o alarme não toca depois.
            unlockAudio();
            dispatch({ type: "START", taskName, now: Date.now() });
        },
        [dispatch],
    );

    const pause = useCallback(
        () => dispatch({ type: "PAUSE", now: Date.now() }),
        [dispatch],
    );
    const resume = useCallback(
        () => dispatch({ type: "RESUME", now: Date.now() }),
        [dispatch],
    );
    const reset = useCallback(
        () => dispatch({ type: "RESET", now: Date.now() }),
        [dispatch],
    );
    const skip = useCallback(
        () => dispatch({ type: "SKIP", now: Date.now() }),
        [dispatch],
    );

    const value = useMemo(
        () => ({ state, start, pause, resume, reset, skip }),
        [state, start, pause, resume, reset, skip],
    );

    return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}
