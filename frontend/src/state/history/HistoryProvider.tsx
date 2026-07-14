import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
    createHistoryEntry,
    parseHistory,
    type HistoryEntry,
    type NewHistoryEntry,
} from "../../domain/history/historyEntry";
import { localStorageAdapter } from "../../infra/localStorageAdapter";
import { StorageKeys } from "../../ports/storage";
import { HistoryContext } from "./HistoryContext";

export function HistoryProvider({ children }: { children: ReactNode }) {
    const [entries, setEntries] = useState<HistoryEntry[]>(() =>
        parseHistory(localStorageAdapter.read(StorageKeys.history)),
    );

    useEffect(() => {
        localStorageAdapter.write(StorageKeys.history, entries);
    }, [entries]);

    // Append-only: o mais recente primeiro, que é a ordem em que a tabela lê.
    const append = useCallback((entry: NewHistoryEntry) => {
        setEntries((current) => [createHistoryEntry(entry), ...current]);
    }, []);

    const clear = useCallback(() => setEntries([]), []);

    const value = useMemo(
        () => ({ entries, append, clear }),
        [entries, append, clear],
    );

    return (
        <HistoryContext.Provider value={value}>
            {children}
        </HistoryContext.Provider>
    );
}
