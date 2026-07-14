import { cycleKindAt } from "../../domain/cycles/cycleSequence";
import { DECADES_PER_ROSARY } from "../../domain/rosary/rosary";
import { useTimer } from "../../state/timer/useTimer";
import styles from "./Cycles.module.css";

/** Um terço inteiro: cinco focos intercalados com as cinco rezas. */
const CYCLES_PER_ROSARY = DECADES_PER_ROSARY * 2;
const cycles = Array.from({ length: CYCLES_PER_ROSARY }, (_, i) => i + 1);

export function Cycles() {
    const { state } = useTimer();

    const position =
        state.status === "idle"
            ? 0
            : ((state.cycle.cycleNumber - 1) % CYCLES_PER_ROSARY) + 1;

    return (
        <>
            <span className={styles.span}>Ciclos:</span>
            <div className={styles.cyclesDots}>
                {cycles.map((cycle) => {
                    const kind = cycleKindAt(cycle);
                    const done = cycle < position;
                    const active = cycle === position;

                    return (
                        <span
                            key={cycle}
                            title={kind === "focus" ? "Foco" : "Reza"}
                            className={[
                                styles.cycleDot,
                                kind === "focus" ? styles.workTime : styles.breakTime,
                                done ? styles.done : "",
                                active ? styles.active : "",
                            ].join(" ")}
                        />
                    );
                })}
            </div>
        </>
    );
}
