import { describe, expect, it } from "vitest";
import { cycleKindAt, durationFor, prayersCompletedBefore } from "./cycleSequence";
import { DEFAULT_SETTINGS, MINUTE_MS } from "../settings/settings";

describe("cycleKindAt", () => {
    it("alterna foco e reza começando pelo foco", () => {
        expect([1, 2, 3, 4, 5].map(cycleKindAt)).toEqual([
            "focus",
            "prayer",
            "focus",
            "prayer",
            "focus",
        ]);
    });
});

describe("durationFor", () => {
    it("usa 25 e 5 minutos por padrão", () => {
        expect(durationFor("focus", DEFAULT_SETTINGS)).toBe(25 * MINUTE_MS);
        expect(durationFor("prayer", DEFAULT_SETTINGS)).toBe(5 * MINUTE_MS);
    });
});

describe("prayersCompletedBefore", () => {
    it("indexa a dezena a partir do número do ciclo", () => {
        // ciclo 2 é a 1ª reza (índice 0), ciclo 4 é a 2ª (índice 1)
        expect(prayersCompletedBefore(2)).toBe(0);
        expect(prayersCompletedBefore(4)).toBe(1);
        expect(prayersCompletedBefore(10)).toBe(4);
    });
});
