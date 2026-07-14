import { House, History, Settings, SunMoon } from "lucide-react";
import styles from "./Menu.module.css";

export function Menu() {
    return (
        <div className="container">
            <div className="content">
                <nav className={styles.menu}>
                    <ul className={styles.list}>
                        <li className={styles.item}>
                            <a href="#home">
                                <House />
                            </a>
                        </li>
                        <li className={styles.item}>
                            <a href="#history">
                                <History />
                            </a>
                        </li>
                        <li className={styles.item}>
                            <a href="#configs">
                                <Settings />
                            </a>
                        </li>
                        <li className={styles.item}>
                            <a href="#theme">
                                <SunMoon />
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
