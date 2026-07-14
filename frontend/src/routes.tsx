import { Navigate, Route, Routes } from "react-router";
import App from "./App";
import { Home } from "./pages/Home/Home";
import { HistoryPage } from "./pages/History/HistoryPage";
import { SettingsPage } from "./pages/Settings/SettingsPage";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<App />}>
                <Route index element={<Home />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
