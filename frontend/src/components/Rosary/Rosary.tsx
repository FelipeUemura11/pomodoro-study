import { prayersCompletedBefore } from "../../domain/cycles/cycleSequence";
import {
    BEADS_PER_DECADE,
    DECADES,
    decadeForPrayer,
    rosaryNumberForPrayer,
} from "../../domain/rosary/rosary";
import { useTimeRemaining } from "../../hooks/useTimeRemaining";
import { formatTime } from "../../lib/formatTime";
import { useTimer } from "../../state/timer/useTimer";
import styles from "./Rosary.module.css";

const beads = Array.from({ length: BEADS_PER_DECADE }, (_, i) => i);

export function Rosary() {
    const { state } = useTimer();
    const remaining = useTimeRemaining(state);

    const prayerIndex = state.status === "idle" ? 0 : prayersCompletedBefore(state.cycle.cycleNumber);
    const activeDecade = decadeForPrayer(prayerIndex);
    const rosaryNumber = rosaryNumberForPrayer(prayerIndex);

    return (
        <div className="container">
            <div className="content">
                <div className={styles.rosary}>
                    <p className={styles.label}>
                        Hora da reza — <strong>{activeDecade}ª dezena</strong>
                        {rosaryNumber > 1 && (
                            <span className={styles.rosaryNumber}>
                                {" "}
                                · {rosaryNumber}º terço
                            </span>
                        )}
                    </p>

                    <ol className={styles.decades}>
                        {DECADES.map((decade) => (
                            <li
                                key={decade}
                                className={`${styles.decade} ${
                                    decade === activeDecade ? styles.active : ""
                                }`}
                                aria-current={decade === activeDecade ? "step" : undefined}
                                aria-label={`${decade}ª dezena`}
                            >
                                {beads.map((bead) => (
                                    <span key={bead} className={styles.bead} />
                                ))}
                            </li>
                        ))}
                    </ol>

                    <div
                        className={styles.timer}
                        role="timer"
                        aria-live="off"
                        aria-label="Tempo restante de reza"
                    >
                        {formatTime(remaining)}
                    </div>
                </div>
            </div>
        </div>
    );
}
