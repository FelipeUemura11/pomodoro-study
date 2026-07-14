import logo from "../../assets/logo.png";
import styles from "./Logo.module.css";

export function Logo() {
    return (
        <div className="container">
            <div className="content">
                <div className={styles.image}>
                    <a href="#">
                        <img src={logo} alt="Logo" />
                    </a>
                </div>
            </div>
        </div>
    );
}
