import { Outlet } from "react-router";
import { Logo } from "./components/Logo/Logo";
import { Menu } from "./components/Menu/Menu";

export default function App() {
    return (
        <>
            <Logo />
            <Menu />
            <main>
                <Outlet />
            </main>
        </>
    );
}
