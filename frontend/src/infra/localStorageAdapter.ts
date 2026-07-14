import type { Storage } from "../ports/storage";

/**
 * `localStorage` lança em modo privado e quando a cota estoura; ler ou gravar
 * uma preferência nunca deve derrubar o app, então as falhas viram no-op.
 */
export const localStorageAdapter: Storage = {
    read(key) {
        try {
            const raw = window.localStorage.getItem(key);
            return raw === null ? undefined : JSON.parse(raw);
        } catch {
            return undefined;
        }
    },

    write(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // sem persistência nesta sessão; a sessão em si segue funcionando
        }
    },
};
