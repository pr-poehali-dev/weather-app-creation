import { useState, useCallback } from "react";

const API_URL = "https://functions.poehali.dev/da6a4b05-6404-4b39-bc85-bd5c251db205";

export interface CurrentWeather {
  city: string;
  country: string;
  temp: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_dir: string;
  visibility: number;
  condition: string;
  icon_code: string;
  uv: number;
  lat: number;
  lon: number;
  sunrise: number;
  sunset: number;
}

export interface ForecastDay {
  date: string;
  temp_high: number;
  temp_low: number;
  condition: string;
  icon_code: string;
  rain_prob: number;
  wind_speed: number;
}

export interface SearchResult {
  name: string;
  name_en: string;
  country: string;
  lat: number;
  lon: number;
}

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCurrent = useCallback(async (params: { city?: string; lat?: number; lon?: number }) => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({ mode: "current" });
      if (params.city) q.set("city", params.city);
      if (params.lat !== undefined) q.set("lat", String(params.lat));
      if (params.lon !== undefined) q.set("lon", String(params.lon));
      const res = await fetch(`${API_URL}?${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка запроса");
      setCurrentWeather(data);
      return data as CurrentWeather;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Не удалось получить погоду";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (params: { city?: string; lat?: number; lon?: number }) => {
    try {
      const q = new URLSearchParams({ mode: "forecast" });
      if (params.city) q.set("city", params.city);
      if (params.lat !== undefined) q.set("lat", String(params.lat));
      if (params.lon !== undefined) q.set("lon", String(params.lon));
      const res = await fetch(`${API_URL}?${q}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка прогноза");
      setForecast(data.forecast || []);
      return data.forecast as ForecastDay[];
    } catch {
      return [];
    }
  }, []);

  const searchCities = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (query.length < 2) return [];
    try {
      const q = new URLSearchParams({ mode: "search", city: query });
      const res = await fetch(`${API_URL}?${q}`);
      const data = await res.json();
      return data.results || [];
    } catch {
      return [];
    }
  }, []);

  return { currentWeather, forecast, loading, error, fetchCurrent, fetchForecast, searchCities };
}

// Конвертация кода иконки OWM в эмодзи
export function owmIconToEmoji(code: string): string {
  if (!code) return "🌡️";
  const id = code.replace("d", "").replace("n", "");
  const map: Record<string, string> = {
    "01": "☀️", "02": "⛅", "03": "☁️", "04": "☁️",
    "09": "🌧️", "10": "🌦️", "11": "⛈️", "13": "❄️", "50": "🌫️",
  };
  return map[id] || "🌡️";
}

export function countryFlag(code: string): string {
  if (!code || code.length !== 2) return "";
  return code.toUpperCase().replace(/./g, c =>
    String.fromCodePoint(127397 + c.charCodeAt(0))
  );
}
