import { describe, expect, it } from "vitest";
import {
    DECADES_PER_ROSARY,
    decadeForPrayer,
    isRosaryComplete,
    rosaryNumberForPrayer,
} from "./rosary";

describe("decadeForPrayer", () => {
    it("avança uma dezena por reza", () => {
        expect([0, 1, 2, 3, 4].map(decadeForPrayer)).toEqual([1, 2, 3, 4, 5]);
    });

    it("volta para a primeira dezena depois da quinta", () => {
        expect(decadeForPrayer(DECADES_PER_ROSARY)).toBe(1);
        expect(decadeForPrayer(DECADES_PER_ROSARY + 1)).toBe(2);
    });
});

describe("rosaryNumberForPrayer", () => {
    it("conta o terço em andamento", () => {
        expect(rosaryNumberForPrayer(0)).toBe(1);
        expect(rosaryNumberForPrayer(4)).toBe(1);
        expect(rosaryNumberForPrayer(5)).toBe(2);
    });
});

describe("isRosaryComplete", () => {
    it("só é verdadeiro a cada cinco rezas", () => {
        expect(isRosaryComplete(0)).toBe(false);
        expect(isRosaryComplete(4)).toBe(false);
        expect(isRosaryComplete(5)).toBe(true);
        expect(isRosaryComplete(10)).toBe(true);
    });
});
