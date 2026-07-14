import { createContext } from "react";
import { IDLE, type TimerState } from "../../domain/timer/timerMachine";

export type TimerContextValue = {
    state: TimerState;
    start: (taskName: string) => void;
    pause: () => void;
    resume: () => void;
    reset: () => void;
    skip: () => void;
};

export const TimerContext = createContext<TimerContextValue>({
    state: IDLE,
    start: () => {},
    pause: () => {},
    resume: () => {},
    reset: () => {},
    skip: () => {},
});
