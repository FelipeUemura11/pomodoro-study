import { describe, expect, it } from "vitest";
import { formatMinutes, formatTime } from "./formatTime";

describe("formatTime", () => {
    it("formata minutos e segundos com dois dígitos", () => {
        expect(formatTime(25 * 60_000)).toBe("25:00");
        expect(formatTime(65_000)).toBe("01:05");
        expect(formatTime(0)).toBe("00:00");
    });

    it("arredonda para cima para não mostrar 00:00 antes do fim", () => {
        expect(formatTime(1)).toBe("00:01");
        expect(formatTime(59_001)).toBe("01:00");
    });

    it("não produz tempo negativo", () => {
        expect(formatTime(-5000)).toBe("00:00");
    });
});

describe("formatMinutes", () => {
    it("mostra a duração em minutos", () => {
        expect(formatMinutes(25 * 60_000)).toBe("25 min");
    });
});
