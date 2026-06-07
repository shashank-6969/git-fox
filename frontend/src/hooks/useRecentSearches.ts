import { useState, useCallback } from 'react';

const STORAGE_KEY = 'gitfox_recent_searches';
const MAX_RECENT = 5;

export function useRecentSearches() {
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const addSearch = useCallback((username: string) => {
    setRecent((prev) => {
      const filtered = prev.filter((u) => u.toLowerCase() !== username.toLowerCase());
      const updated = [username, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const removeSearch = useCallback((username: string) => {
    setRecent((prev) => {
      const updated = prev.filter((u) => u !== username);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { recent, addSearch, removeSearch, clearAll };
}
