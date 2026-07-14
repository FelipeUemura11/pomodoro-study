import {
    MAX_DURATION_MINUTES,
    MINUTE_MS,
    MIN_DURATION_MINUTES,
    clampDurationMinutes,
    type Settings,
} from "../../domain/settings/settings";
import { DefaultInput } from "../../components/DefaultInput/DefaultInput";
import { useSettings } from "../../state/settings/useSettings";
import { useTimer } from "../../state/timer/useTimer";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
    const { settings, updateSettings, resetSettings } = useSettings();
    const { state } = useTimer();

    function handleChange(key: keyof Settings, raw: string) {
        // Campo vazio durante a digitação não deve virar NaN nas settings.
        if (raw === "") return;
        updateSettings({ [key]: clampDurationMinutes(Number(raw)) * MINUTE_MS });
    }

    return (
        <div className="container">
            <div className={`content ${styles.wrapper}`}>
                <h1 className={styles.title}>Configurações</h1>

                <div className={styles.field}>
                    <DefaultInput
                        id="focus-duration"
                        type="number"
                        labelText="Duração do foco (minutos)"
                        min={MIN_DURATION_MINUTES}
                        max={MAX_DURATION_MINUTES}
                        value={Math.round(settings.focusDuration / MINUTE_MS)}
                        onChange={(e) => handleChange("focusDuration", e.target.value)}
                    />
                </div>

                <div className={styles.field}>
                    <DefaultInput
                        id="prayer-duration"
                        type="number"
                        labelText="Duração da reza (minutos)"
                        min={MIN_DURATION_MINUTES}
                        max={MAX_DURATION_MINUTES}
                        value={Math.round(settings.prayerDuration / MINUTE_MS)}
                        onChange={(e) => handleChange("prayerDuration", e.target.value)}
                    />
                </div>

                <p className={styles.note}>
                    Entre {MIN_DURATION_MINUTES} e {MAX_DURATION_MINUTES} minutos.
                    {state.status !== "idle" &&
                        " O ciclo em andamento mantém a duração com que começou."}
                </p>

                <button
                    type="button"
                    className={styles.resetButton}
                    onClick={resetSettings}
                >
                    Restaurar padrões (25 / 5)
                </button>
            </div>
        </div>
    );
}
