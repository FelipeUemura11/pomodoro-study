import { House, History, Settings, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router";
import { useTheme } from "../../state/theme/useTheme";
import styles from "./Menu.module.css";

const links = [
    { to: "/", label: "Início", Icon: House },
    { to: "/history", label: "Histórico", Icon: History },
    { to: "/settings", label: "Configurações", Icon: Settings },
];

export function Menu() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="container">
            <div className="content">
                <nav className={styles.menu}>
                    <ul className={styles.list}>
                        {links.map(({ to, label, Icon }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={to === "/"}
                                    aria-label={label}
                                    title={label}
                                    className={({ isActive }) =>
                                        `${styles.listItem} ${isActive ? styles.active : ""}`
                                    }
                                >
                                    <Icon />
                                </NavLink>
                            </li>
                        ))}

                        {/* Tema é ação, não navegação: botão, não link. */}
                        <li>
                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={styles.listItem}
                                aria-label={
                                    theme === "dark"
                                        ? "Ativar modo diurno"
                                        : "Ativar modo noturno"
                                }
                                title={
                                    theme === "dark"
                                        ? "Ativar modo diurno"
                                        : "Ativar modo noturno"
                                }
                            >
                                {theme === "dark" ? <Sun /> : <Moon />}
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
