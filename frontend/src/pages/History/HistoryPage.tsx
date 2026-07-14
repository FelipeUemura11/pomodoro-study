import { formatDateTime, formatTime } from "../../lib/formatTime";
import { useHistory } from "../../state/history/useHistory";
import styles from "./HistoryPage.module.css";

export function HistoryPage() {
    const { entries, clear } = useHistory();

    return (
        <div className="container">
            <div className={`content ${styles.wrapper}`}>
                <header className={styles.header}>
                    <h1 className={styles.title}>Histórico</h1>
                    {entries.length > 0 && (
                        <button
                            type="button"
                            className={styles.clearButton}
                            onClick={clear}
                        >
                            Limpar histórico
                        </button>
                    )}
                </header>

                {entries.length === 0 ? (
                    <p className={styles.empty}>
                        Nenhum ciclo registrado ainda. Comece um foco na tela inicial.
                    </p>
                ) : (
                    /* A tabela rola sozinha em telas estreitas; a página não. */
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Tarefa</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Duração</th>
                                    <th scope="col">Início</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry) => (
                                    <tr key={entry.id}>
                                        <td>{entry.taskName}</td>
                                        <td>{entry.kind === "focus" ? "Foco" : "Reza"}</td>
                                        <td>{formatTime(entry.duration)}</td>
                                        <td>{formatDateTime(entry.startedAt)}</td>
                                        <td>
                                            <span
                                                className={
                                                    entry.status === "completed"
                                                        ? styles.completed
                                                        : styles.interrupted
                                                }
                                            >
                                                {entry.status === "completed"
                                                    ? "Concluído"
                                                    : "Interrompido"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
