import styles from "./CountDown.module.css";

export function CountDown() {
    return (
        <div className="container">
            <div className="content">
                <div className={styles.timer}>00:00</div>
            </div>
        </div>
    );
}
