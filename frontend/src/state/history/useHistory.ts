import { useContext } from "react";
import { HistoryContext } from "./HistoryContext";

export function useHistory() {
    return useContext(HistoryContext);
}
