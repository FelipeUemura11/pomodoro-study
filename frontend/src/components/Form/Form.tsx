import { useState, type FormEvent } from "react";
import { Pause, Play, Square } from "lucide-react";
import { currentKind } from "../../domain/timer/timerMachine";
import { useTimer } from "../../state/timer/useTimer";
import { Cycles } from "../Cycles/Cycles";
import { DefaultButton } from "../DefaultButton/DefaultButton";
import { DefaultInput } from "../DefaultInput/DefaultInput";
import styles from "./Form.module.css";

const messages = {
    idle: "Digite sua tarefa e comece o foco.",
    focus: "Foco — mantenha-se na tarefa.",
    prayer: "Hora da reza. Respire e reze a dezena.",
};

export function Form() {
    const { state, start, pause, resume, reset } = useTimer();
    const [taskName, setTaskName] = useState("");

    const isIdle = state.status === "idle";
    const kind = currentKind(state);
    const value = isIdle ? taskName : state.cycle.taskName;

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const trimmed = taskName.trim();
        if (!isIdle || !trimmed) return;
        start(trimmed);
    }

    return (
        <div className="container">
            <div className="content">
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <DefaultInput
                            id="task-name"
                            type="text"
                            labelText="Tarefa"
                            placeholder="Digite sua tarefa"
                            value={value}
                            onChange={(e) => setTaskName(e.target.value)}
                            disabled={!isIdle}
                            maxLength={80}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <p aria-live="polite">
                            {isIdle ? messages.idle : messages[kind ?? "focus"]}
                        </p>
                    </div>

                    <div className={styles.formRow}>
                        <Cycles />
                    </div>

                    <div className={`${styles.formRow} ${styles.actions}`}>
                        {isIdle ? (
                            <DefaultButton
                                type="submit"
                                icon={<Play />}
                                aria-label="Iniciar foco"
                                title="Iniciar foco"
                                disabled={!taskName.trim()}
                            />
                        ) : (
                            <>
                                {state.status === "running" ? (
                                    <DefaultButton
                                        icon={<Pause />}
                                        onClick={pause}
                                        aria-label="Pausar"
                                        title="Pausar"
                                    />
                                ) : (
                                    <DefaultButton
                                        icon={<Play />}
                                        onClick={resume}
                                        aria-label="Retomar"
                                        title="Retomar"
                                    />
                                )}
                                <DefaultButton
                                    icon={<Square />}
                                    color="red"
                                    onClick={reset}
                                    aria-label="Parar"
                                    title="Parar"
                                />
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
