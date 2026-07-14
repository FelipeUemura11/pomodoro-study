import { describe, expect, it } from "vitest";
import {
    DEFAULT_SETTINGS,
    MAX_DURATION_MINUTES,
    MIN_DURATION_MINUTES,
    MINUTE_MS,
    clampDurationMinutes,
    parseSettings,
} from "./settings";

describe("clampDurationMinutes", () => {
    it("mantém valores dentro dos limites", () => {
        expect(clampDurationMinutes(25)).toBe(25);
    });

    it("prende valores fora dos limites", () => {
        expect(clampDurationMinutes(0)).toBe(MIN_DURATION_MINUTES);
        expect(clampDurationMinutes(-5)).toBe(MIN_DURATION_MINUTES);
        expect(clampDurationMinutes(9999)).toBe(MAX_DURATION_MINUTES);
    });

    it("degrada NaN para o mínimo em vez de propagar", () => {
        expect(clampDurationMinutes(NaN)).toBe(MIN_DURATION_MINUTES);
    });
});

describe("parseSettings", () => {
    it("aceita dados válidos", () => {
        const raw = { focusDuration: 30 * MINUTE_MS, prayerDuration: 10 * MINUTE_MS };
        expect(parseSettings(raw)).toEqual(raw);
    });

    it("cai nos defaults para lixo vindo do storage", () => {
        expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
        expect(parseSettings("nada")).toEqual(DEFAULT_SETTINGS);
        expect(parseSettings({})).toEqual(DEFAULT_SETTINGS);
        expect(parseSettings({ focusDuration: "abc" })).toEqual(DEFAULT_SETTINGS);
    });

    it("prende durações absurdas vindas do storage", () => {
        expect(parseSettings({ focusDuration: 9999 * MINUTE_MS }).focusDuration).toBe(
            MAX_DURATION_MINUTES * MINUTE_MS,
        );
    });
});
