import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useWeather, owmIconToEmoji, countryFlag, type CurrentWeather, type SearchResult } from "@/hooks/useWeather";

const TRENDING = ["Дубай", "Барселона", "Токио", "Сочи", "Нью-Йорк", "Стамбул"];

export default function WeatherSearch() {
  const { searchCities, fetchCurrent } = useWeather();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selected, setSelected] = useState<CurrentWeather | null>(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setResults([]); return; }
    setLoadingSearch(true);
    debounceRef.current = setTimeout(async () => {
      const res = await searchCities(query);
      setResults(res);
      setLoadingSearch(false);
    }, 400);
  }, [query]);

  const handleSelect = async (item: SearchResult) => {
    setLoadingDetail(true);
    setSelected(null);
    const data = await fetchCurrent({ lat: item.lat, lon: item.lon });
    if (data) setSelected(data);
    setLoadingDetail(false);
  };

  const handleTrending = async (cityName: string) => {
    setQuery(cityName);
    setLoadingDetail(true);
    setSelected(null);
    const data = await fetchCurrent({ city: cityName });
    if (data) setSelected(data);
    setLoadingDetail(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6">
      <div className="mb-6 animate-fade-in">
        <h1 className="font-unbounded text-xl font-bold text-white mb-1">Поиск</h1>
        <p className="text-white/40 text-sm">Найди погоду в любом городе мира</p>
      </div>

      {/* Search input */}
      <div className="relative mb-6 animate-slide-up stagger-1">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Введи название города..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
          className="w-full pl-11 pr-4 py-4 rounded-2xl glass-card-bright text-white placeholder-white/30 text-base outline-none transition-all font-golos"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        />
        {(query || loadingSearch) && (
          <button onClick={() => { setQuery(""); setResults([]); setSelected(null); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
            {loadingSearch
              ? <span className="animate-spin inline-block">⟳</span>
              : <Icon name="X" size={16} />}
          </button>
        )}
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden mb-6 animate-fade-in">
          {results.map((item, i) => (
            <button
              key={`${item.lat}-${item.lon}`}
              onClick={() => handleSelect(item)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 transition-all hover:bg-white/5 active:bg-white/10 text-left ${i > 0 ? "border-t border-white/5" : ""}`}
            >
              <span className="text-2xl">{countryFlag(item.country)}</span>
              <div className="flex-1">
                <div className="text-white font-semibold">{item.name}</div>
                <div className="text-white/40 text-sm">{item.name_en !== item.name ? `${item.name_en} · ` : ""}{item.country}</div>
              </div>
              <Icon name="ChevronRight" size={16} className="text-white/30" />
            </button>
          ))}
        </div>
      )}

      {/* Selected city detail */}
      {(loadingDetail || selected) && (
        <div className="glass-card-bright rounded-2xl p-5 mb-6 animate-slide-up border border-sky-500/20">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-6 text-3xl animate-spin">⟳</div>
          ) : selected && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{owmIconToEmoji(selected.icon_code)}</span>
                <div>
                  <div className="text-white font-unbounded font-bold text-lg">
                    {selected.city} {countryFlag(selected.country)}
                  </div>
                  <div className="text-white/50 text-sm capitalize">{selected.condition}</div>
                </div>
                <div className="ml-auto text-5xl font-unbounded font-black text-white">{selected.temp}°</div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">Влажность</div>
                  <div className="text-white font-semibold">{selected.humidity}%</div>
                </div>
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">Ветер</div>
                  <div className="text-white font-semibold">{selected.wind_speed} км/ч</div>
                </div>
                <div className="text-center">
                  <div className="text-white/40 text-xs mb-1">Давление</div>
                  <div className="text-white font-semibold">{selected.pressure} мм</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Trending */}
      {!query && !selected && (
        <div className="animate-slide-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="TrendingUp" size={14} className="text-orange-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Популярные направления</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TRENDING.map((name) => (
              <button
                key={name}
                onClick={() => handleTrending(name)}
                className="glass-card p-4 rounded-xl flex items-center gap-3 hover:bg-white/8 transition-all active:scale-95 text-left"
              >
                <span className="text-3xl">🌍</span>
                <div>
                  <div className="text-white font-semibold text-sm">{name}</div>
                  <div className="text-white/40 text-xs">Нажми для погоды</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query.length > 1 && !loadingSearch && results.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-white/60 font-medium">Город не найден</div>
          <div className="text-white/30 text-sm mt-1">Попробуй другое название</div>
        </div>
      )}
    </div>
  );
}
