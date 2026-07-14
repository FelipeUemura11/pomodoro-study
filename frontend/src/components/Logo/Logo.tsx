import { Link } from "react-router";
import logo from "../../assets/logo.png";
import styles from "./Logo.module.css";

export function Logo() {
    return (
        <div className="container">
            <div className="content">
                <div className={styles.image}>
                    <Link to="/" aria-label="Ir para o início">
                        <img className={styles.img} src={logo} alt="Pomodoro Study" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
