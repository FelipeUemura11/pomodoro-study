import { CountDown } from "./components/CountDown/CountDown";
import { Logo } from "./components/Logo/Logo";
import { Menu } from "./components/Menu/Menu";
import { Form } from "./components/Form/Form";
import { Footer } from "./components/Footer/Footer";

export default function App() {
    return (
        <>
            <Logo />
            <Menu />
            <CountDown />
            <Form />
            <Footer />
        </>
    );
}
