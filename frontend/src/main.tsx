import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary.tsx";
import { AppRoutes } from "./routes.tsx";
import { HistoryProvider } from "./state/history/HistoryProvider.tsx";
import { SettingsProvider } from "./state/settings/SettingsProvider.tsx";
import { ThemeProvider } from "./state/theme/ThemeProvider.tsx";
import { TimerProvider } from "./state/timer/TimerProvider.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <ThemeProvider>
                <SettingsProvider>
                    <HistoryProvider>
                        <TimerProvider>
                            <BrowserRouter>
                                <AppRoutes />
                            </BrowserRouter>
                        </TimerProvider>
                    </HistoryProvider>
                </SettingsProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </StrictMode>,
);
