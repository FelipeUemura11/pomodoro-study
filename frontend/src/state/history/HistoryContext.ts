import { createContext } from "react";
import type {
    HistoryEntry,
    NewHistoryEntry,
} from "../../domain/history/historyEntry";

export type HistoryContextValue = {
    entries: HistoryEntry[];
    append: (entry: NewHistoryEntry) => void;
    clear: () => void;
};

export const HistoryContext = createContext<HistoryContextValue>({
    entries: [],
    append: () => {},
    clear: () => {},
});
