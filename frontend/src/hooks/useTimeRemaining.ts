import { useCallback, useSyncExternalStore } from "react";
import { remainingMs, type TimerState } from "../domain/timer/timerMachine";
import { getClockSnapshot, subscribeToClock } from "../infra/clock";

const noop = () => () => {};

/**
 * O tick só existe para re-renderizar — quem diz o tempo é `remainingMs` sobre
 * o instante atual. Nada é decrementado, então nenhum tick perdido (aba em
 * segundo plano, reload) corrompe a contagem.
 *
 * Parado ou pausado, `remainingMs` nem olha o relógio, então não assinamos:
 * nenhum intervalo fica rodando à toa.
 */
export function useTimeRemaining(state: TimerState): number {
    const isRunning = state.status === "running";

    const subscribe = useCallback(
        (onChange: () => void) => (isRunning ? subscribeToClock(onChange) : noop()),
        [isRunning],
    );

    const now = useSyncExternalStore(subscribe, getClockSnapshot);

    return remainingMs(state, now);
}
