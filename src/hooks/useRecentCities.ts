import { useState, useCallback } from "react";

export interface RecentCity {
  city: string;
  country: string;
  temp: number;
  icon_code: string;
  lat: number;
  lon: number;
  viewedAt: number;
}

const KEY = "skypulse_recent_cities";
const MAX = 8;

function loadRecent(): RecentCity[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecent(list: RecentCity[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function useRecentCities() {
  const [recent, setRecent] = useState<RecentCity[]>(loadRecent);

  const addRecent = useCallback((city: RecentCity) => {
    setRecent((prev) => {
      const filtered = prev.filter(
        (c) => !(c.city === city.city && c.country === city.country)
      );
      const updated = [{ ...city, viewedAt: Date.now() }, ...filtered].slice(0, MAX);
      saveRecent(updated);
      return updated;
    });
  }, []);

  const removeRecent = useCallback((city: string, country: string) => {
    setRecent((prev) => {
      const updated = prev.filter(
        (c) => !(c.city === city && c.country === country)
      );
      saveRecent(updated);
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(KEY);
    setRecent([]);
  }, []);

  return { recent, addRecent, removeRecent, clearRecent };
}
