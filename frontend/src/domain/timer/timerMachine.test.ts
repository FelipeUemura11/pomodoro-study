import { describe, expect, it } from "vitest";
import {
    IDLE,
    type TimerState,
    currentKind,
    elapsedMs,
    remainingMs,
    transition,
} from "./timerMachine";
import { DEFAULT_SETTINGS, MINUTE_MS } from "../settings/settings";

const S = DEFAULT_SETTINGS;
const T0 = 1_000_000;
const FOCUS = 25 * MINUTE_MS;
const PRAYER = 5 * MINUTE_MS;

function started(now = T0): TimerState {
    return transition(IDLE, { type: "START", taskName: "Estudar", now }, S).state;
}

/** Avança até o fim do ciclo atual e aplica COMPLETE. */
function complete(state: TimerState, now: number) {
    return transition(state, { type: "COMPLETE", now }, S);
}

describe("START", () => {
    it("começa no ciclo 1 de foco, rodando", () => {
        const state = started();
        expect(state.status).toBe("running");
        expect(currentKind(state)).toBe("focus");
        expect(remainingMs(state, T0)).toBe(FOCUS);
    });

    it("é ignorado se já houver um ciclo em andamento", () => {
        const state = started();
        const again = transition(state, { type: "START", taskName: "Outra", now: T0 + 5 }, S);
        expect(again.state).toBe(state);
    });
});

describe("tempo derivado do relógio", () => {
    it("desconta o tempo real decorrido", () => {
        const state = started();
        expect(remainingMs(state, T0 + 10 * MINUTE_MS)).toBe(15 * MINUTE_MS);
    });

    it("não fica negativo depois do fim", () => {
        const state = started();
        expect(remainingMs(state, T0 + 99 * MINUTE_MS)).toBe(0);
    });

    it("permanece correto após um salto longo do relógio (aba em background)", () => {
        // É a razão de derivar de Date.now() em vez de decrementar num setInterval:
        // nenhum tick precisa ter acontecido durante o salto.
        const state = started();
        expect(remainingMs(state, T0 + 24 * MINUTE_MS)).toBe(1 * MINUTE_MS);
    });
});

describe("PAUSE / RESUME", () => {
    it("congela o tempo restante enquanto pausado", () => {
        const running = started();
        const { state: paused } = transition(running, { type: "PAUSE", now: T0 + 10 * MINUTE_MS }, S);

        expect(paused.status).toBe("paused");
        expect(remainingMs(paused, T0 + 10 * MINUTE_MS)).toBe(15 * MINUTE_MS);
        // uma hora depois, ainda pausado, o restante não mudou
        expect(remainingMs(paused, T0 + 70 * MINUTE_MS)).toBe(15 * MINUTE_MS);
    });

    it("retoma de onde parou, ignorando o tempo em pausa", () => {
        const running = started();
        const { state: paused } = transition(running, { type: "PAUSE", now: T0 + 10 * MINUTE_MS }, S);
        const { state: resumed } = transition(paused, { type: "RESUME", now: T0 + 70 * MINUTE_MS }, S);

        expect(resumed.status).toBe("running");
        expect(remainingMs(resumed, T0 + 70 * MINUTE_MS)).toBe(15 * MINUTE_MS);
        expect(remainingMs(resumed, T0 + 75 * MINUTE_MS)).toBe(10 * MINUTE_MS);
    });

    it("ignora PAUSE fora de running e RESUME fora de paused", () => {
        expect(transition(IDLE, { type: "PAUSE", now: T0 }, S).state).toBe(IDLE);
        const running = started();
        expect(transition(running, { type: "RESUME", now: T0 }, S).state).toBe(running);
    });
});

describe("COMPLETE", () => {
    it("não completa antes da hora", () => {
        const state = started();
        const result = complete(state, T0 + 1 * MINUTE_MS);
        expect(result.state).toBe(state);
        expect(result.effects).toEqual([]);
    });

    it("ao fim do foco toca o alarme e vai para a reza", () => {
        const state = started();
        const result = complete(state, T0 + FOCUS);

        expect(currentKind(result.state)).toBe("prayer");
        expect(result.state.status).toBe("running");
        expect(remainingMs(result.state, T0 + FOCUS)).toBe(PRAYER);
        expect(result.effects).toContainEqual({ type: "playAlarm" });
    });

    it("registra o ciclo de foco como completo", () => {
        const result = complete(started(), T0 + FOCUS);
        expect(result.effects).toContainEqual({
            type: "cycleEnded",
            entry: {
                taskName: "Estudar",
                kind: "focus",
                startedAt: T0,
                completedAt: T0 + FOCUS,
                duration: FOCUS,
                status: "completed",
            },
        });
    });

    it("volta ao foco depois da reza", () => {
        const afterFocus = complete(started(), T0 + FOCUS).state;
        const afterPrayer = complete(afterFocus, T0 + FOCUS + PRAYER).state;

        expect(currentKind(afterPrayer)).toBe("focus");
        expect(remainingMs(afterPrayer, T0 + FOCUS + PRAYER)).toBe(FOCUS);
    });
});

describe("sequência completa do terço", () => {
    it("as cinco rezas avançam as dezenas e o sexto terço reinicia", () => {
        // Percorre foco → reza cinco vezes e confere o número do ciclo resultante.
        let state = started();
        let now = T0;

        for (let prayer = 0; prayer < 5; prayer++) {
            now += FOCUS;
            state = complete(state, now).state;
            expect(currentKind(state)).toBe("prayer");

            now += PRAYER;
            state = complete(state, now).state;
            expect(currentKind(state)).toBe("focus");
        }

        // após 5 focos e 5 rezas concluídos, estamos no 11º ciclo
        expect(state.status).toBe("running");
        expect(remainingMs(state, now)).toBe(FOCUS);
    });
});

describe("RESET", () => {
    it("volta para idle e registra o ciclo como interrompido", () => {
        const state = started();
        const result = transition(state, { type: "RESET", now: T0 + 10 * MINUTE_MS }, S);

        expect(result.state).toEqual(IDLE);
        expect(result.effects).toEqual([
            {
                type: "cycleEnded",
                entry: {
                    taskName: "Estudar",
                    kind: "focus",
                    startedAt: T0,
                    completedAt: T0 + 10 * MINUTE_MS,
                    duration: 10 * MINUTE_MS,
                    status: "interrupted",
                },
            },
        ]);
    });

    it("não registra nada se nenhum tempo passou", () => {
        const result = transition(started(), { type: "RESET", now: T0 }, S);
        expect(result.effects).toEqual([]);
    });

    it("é ignorado em idle", () => {
        const result = transition(IDLE, { type: "RESET", now: T0 }, S);
        expect(result.state).toBe(IDLE);
        expect(result.effects).toEqual([]);
    });
});

describe("SKIP", () => {
    it("pula para o próximo ciclo marcando o atual como interrompido", () => {
        const result = transition(started(), { type: "SKIP", now: T0 + 2 * MINUTE_MS }, S);

        expect(currentKind(result.state)).toBe("prayer");
        expect(result.effects).toHaveLength(1);
        expect(result.effects[0]).toMatchObject({
            type: "cycleEnded",
            entry: { status: "interrupted", duration: 2 * MINUTE_MS },
        });
    });
});

describe("elapsedMs", () => {
    it("é zero em idle", () => {
        expect(elapsedMs(IDLE, T0)).toBe(0);
    });
});
