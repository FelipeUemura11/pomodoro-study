import { Outlet } from "react-router";
import { Logo } from "./components/Logo/Logo";
import { Menu } from "./components/Menu/Menu";
import styles from "./App.module.css";

export default function App() {
    return (
        <div className={styles.app}>
            <Logo />
            <Menu />
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
