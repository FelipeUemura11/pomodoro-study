import { createContext } from "react";
import { DEFAULT_SETTINGS, type Settings } from "../../domain/settings/settings";

export type SettingsContextValue = {
    settings: Settings;
    updateSettings: (patch: Partial<Settings>) => void;
    resetSettings: () => void;
};

export const SettingsContext = createContext<SettingsContextValue>({
    settings: DEFAULT_SETTINGS,
    updateSettings: () => {},
    resetSettings: () => {},
});
