import { Heart } from "lucide-react";

import styles from "./Footer.module.css";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <a href="">Entenda como funciona a tecnica pomodoro</a>
            <a href="">Pomodoro Study &copy; {new Date().getFullYear()} - Feito com <Heart /></a>
        </footer>
    );
}
