const STORAGE_KEYS = {
    draft: 'qr-generator:draft',
    history: 'qr-generator:history'
};

const HISTORY_LIMIT = 10;

function readJson(key, fallbackValue) {
    try {
        const rawValue = localStorage.getItem(key);
        return rawValue ? JSON.parse(rawValue) : fallbackValue;
    } catch {
        return fallbackValue;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function loadDraftState() {
    return readJson(STORAGE_KEYS.draft, null);
}

export function saveDraftState(state) {
    writeJson(STORAGE_KEYS.draft, state);
}

export function loadHistory() {
    return readJson(STORAGE_KEYS.history, []);
}

export function saveHistory(history) {
    writeJson(STORAGE_KEYS.history, history.slice(0, HISTORY_LIMIT));
}

export function upsertHistoryEntry(entry) {
    const history = loadHistory();
    const filteredEntries = history.filter((item) => item.id !== entry.id && item.text !== entry.text);
    const updatedHistory = [entry, ...filteredEntries].slice(0, HISTORY_LIMIT);
    saveHistory(updatedHistory);
    return updatedHistory;
}

export function toggleFavorite(entryId) {
    const history = loadHistory().map((entry) => {
        if (entry.id === entryId) {
            return { ...entry, favorite: !entry.favorite };
        }
        return entry;
    });

    saveHistory(history);
    return history;
}

export function deleteHistoryEntry(entryId) {
    const history = loadHistory().filter((entry) => entry.id !== entryId);
    saveHistory(history);
    return history;
}
