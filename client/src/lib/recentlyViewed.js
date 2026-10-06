const STORAGE_KEY = 'webfarmswear_recently_viewed';
const MAX_ITEMS = 10;

// Per-viewer convenience only (which products they've browsed) — never
// anything that needs to be shared across devices or read back by the
// server, so plain localStorage is the right tool here.
export function recordRecentlyViewed(productId) {
    try {
        const existing = getRecentlyViewedIds().filter((id) => id !== productId);
        const updated = [productId, ...existing].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
        // Private browsing / storage disabled — silently skip, not essential.
    }
}

export function getRecentlyViewedIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
