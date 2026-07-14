import { useContext } from "react";
import { TimerContext } from "./TimerContext";

export function useTimer() {
    return useContext(TimerContext);
}
