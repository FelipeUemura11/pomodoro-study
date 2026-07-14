import styles from "./Cycles.module.css";

export function Cycles() {
    return (
        <div>
            <span>Ciclos:</span>
            <div className={styles.cyclesDots}>
                <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.breakTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.breakTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.breakTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.workTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.breakTime}`}></span>
                <span className={`${styles.cycleDot} ${styles.longWorkTime}`}></span>
            </div>
        </div>
    );
}
