import { currentKind } from "../../domain/timer/timerMachine";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { CountDown } from "../../components/CountDown/CountDown";
import { Form } from "../../components/Form/Form";
import { Rosary } from "../../components/Rosary/Rosary";
import { useTimer } from "../../state/timer/useTimer";

export function Home() {
    const { state } = useTimer();
    useDocumentTitle(state);

    // Contador e terço são irmãos: a página escolhe qual mostrar, em vez de um
    // condicional dentro do CountDown.
    const isPrayer = currentKind(state) === "prayer";

    return (
        <>
            {isPrayer ? <Rosary /> : <CountDown />}
            <Form />
        </>
    );
}
