import { useTimeRemaining } from "../../hooks/useTimeRemaining";
import { formatTime } from "../../lib/formatTime";
import { useSettings } from "../../state/settings/useSettings";
import { useTimer } from "../../state/timer/useTimer";
import styles from "./CountDown.module.css";

export function CountDown() {
    const { state } = useTimer();
    const { settings } = useSettings();
    const remaining = useTimeRemaining(state);

    // Parado, o mostrador antecipa a duração configurada em vez de 00:00.
    const display = state.status === "idle" ? settings.focusDuration : remaining;

    return (
        <div className="container">
            <div className="content">
                <div
                    className={styles.timer}
                    role="timer"
                    aria-live="off"
                    aria-label="Tempo restante de foco"
                >
                    {formatTime(display)}
                </div>
            </div>
        </div>
    );
}
