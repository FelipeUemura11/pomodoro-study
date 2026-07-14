import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { localStorageAdapter } from "../../infra/localStorageAdapter";
import { StorageKeys } from "../../ports/storage";
import { ThemeContext, type Theme } from "./ThemeContext";

function initialTheme(): Theme {
    const stored = localStorageAdapter.read(StorageKeys.theme);
    if (stored === "light" || stored === "dark") return stored;

    // Sem preferência gravada, segue o sistema em vez de impor um padrão.
    const prefersLight =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: light)").matches;

    return prefersLight ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(initialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorageAdapter.write(StorageKeys.theme, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === "dark" ? "light" : "dark"));
    }, []);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
