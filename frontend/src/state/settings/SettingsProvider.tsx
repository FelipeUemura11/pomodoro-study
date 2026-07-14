import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    DEFAULT_SETTINGS,
    parseSettings,
    type Settings,
} from "../../domain/settings/settings";
import { localStorageAdapter } from "../../infra/localStorageAdapter";
import { StorageKeys } from "../../ports/storage";
import { SettingsContext } from "./SettingsContext";

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<Settings>(() =>
        parseSettings(localStorageAdapter.read(StorageKeys.settings)),
    );

    useEffect(() => {
        localStorageAdapter.write(StorageKeys.settings, settings);
    }, [settings]);

    const updateSettings = useCallback((patch: Partial<Settings>) => {
        setSettings((current) => parseSettings({ ...current, ...patch }));
    }, []);

    const resetSettings = useCallback(() => setSettings(DEFAULT_SETTINGS), []);

    const value = useMemo(
        () => ({ settings, updateSettings, resetSettings }),
        [settings, updateSettings, resetSettings],
    );

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
}
