/** Um terço tem cinco dezenas de dez contas. Domínio, não configuração. */
export const DECADES_PER_ROSARY = 5;
export const BEADS_PER_DECADE = 10;

export const DECADES = Array.from(
    { length: DECADES_PER_ROSARY },
    (_, i) => i + 1,
);

/** `prayerIndex` é 0-based; a dezena resultante é 1-based (1..5). */
export function decadeForPrayer(prayerIndex: number): number {
    return (prayerIndex % DECADES_PER_ROSARY) + 1;
}

/** Quantos terços inteiros já foram completados antes desta reza. */
export function rosaryNumberForPrayer(prayerIndex: number): number {
    return Math.floor(prayerIndex / DECADES_PER_ROSARY) + 1;
}

export function isRosaryComplete(prayersCompleted: number): boolean {
    return prayersCompleted > 0 && prayersCompleted % DECADES_PER_ROSARY === 0;
}
