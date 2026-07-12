import { CountDown } from "./components/CountDown/CountDown";
import { Logo } from "./components/Logo/Logo";
import { Menu } from "./components/Menu/Menu";
import { Form } from "./components/Form/Form";

export default function App() {
    return (
        <>
            <Logo />
        
            <Menu />  
        
            <CountDown />
        
            <Form />
            
        </>
    );
}
