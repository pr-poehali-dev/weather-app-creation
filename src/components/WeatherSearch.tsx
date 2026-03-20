import { useState } from "react";
import Icon from "@/components/ui/icon";

const allCities = [
  { name: "Москва", country: "Россия", temp: 3, icon: "☁️", condition: "Облачно" },
  { name: "Санкт-Петербург", country: "Россия", temp: 1, icon: "❄️", condition: "Снег" },
  { name: "Сочи", country: "Россия", temp: 18, icon: "☀️", condition: "Ясно" },
  { name: "Казань", country: "Россия", temp: -5, icon: "🥶", condition: "Мороз" },
  { name: "Екатеринбург", country: "Россия", temp: -8, icon: "🌨️", condition: "Снегопад" },
  { name: "Новосибирск", country: "Россия", temp: -15, icon: "❄️", condition: "Мороз" },
  { name: "Краснодар", country: "Россия", temp: 12, icon: "🌤️", condition: "Переменная облачность" },
  { name: "Нижний Новгород", country: "Россия", temp: -3, icon: "☁️", condition: "Пасмурно" },
  { name: "Лондон", country: "Великобритания", temp: 8, icon: "🌧️", condition: "Дождь" },
  { name: "Париж", country: "Франция", temp: 11, icon: "🌤️", condition: "Переменная облачность" },
  { name: "Нью-Йорк", country: "США", temp: 5, icon: "💨", condition: "Ветрено" },
  { name: "Токио", country: "Япония", temp: 15, icon: "🌸", condition: "Ясно" },
  { name: "Дубай", country: "ОАЭ", temp: 32, icon: "☀️", condition: "Жарко" },
  { name: "Барселона", country: "Испания", temp: 19, icon: "🌤️", condition: "Солнечно" },
  { name: "Берлин", country: "Германия", temp: 6, icon: "☁️", condition: "Пасмурно" },
];

const trending = ["Дубай", "Барселона", "Токио", "Сочи"];

export default function WeatherSearch() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof allCities[0] | null>(null);

  const filtered = query.length > 1
    ? allCities.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.country.toLowerCase().includes(query.toLowerCase())
      )
    : [];

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
          className="w-full pl-11 pr-4 py-4 rounded-2xl glass-card-bright text-white placeholder-white/30 text-base outline-none focus:border-sky-500/50 transition-all font-golos"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
            <Icon name="X" size={16} />
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden mb-6 animate-fade-in">
          {filtered.map((city, i) => (
            <button
              key={city.name}
              onClick={() => setSelected(city)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 transition-all hover:bg-white/5 active:bg-white/10 text-left ${i > 0 ? "border-t border-white/5" : ""}`}
            >
              <span className="text-2xl">{city.icon}</span>
              <div className="flex-1">
                <div className="text-white font-semibold">{city.name}</div>
                <div className="text-white/40 text-sm">{city.country}</div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold text-lg">{city.temp}°</div>
                <div className="text-white/40 text-xs">{city.condition}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected city detail */}
      {selected && (
        <div className="glass-card-bright rounded-2xl p-5 mb-6 animate-slide-up border border-sky-500/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">{selected.icon}</span>
            <div>
              <div className="text-white font-unbounded font-bold text-lg">{selected.name}</div>
              <div className="text-white/50 text-sm">{selected.country}</div>
            </div>
            <div className="ml-auto text-4xl font-unbounded font-black text-white">{selected.temp}°</div>
          </div>
          <div className="text-white/60 text-sm mb-4">{selected.condition}</div>
          <button className="w-full py-3 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-all active:scale-95">
            Открыть прогноз на неделю
          </button>
        </div>
      )}

      {/* Trending */}
      {!query && (
        <div className="animate-slide-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="TrendingUp" size={14} className="text-orange-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Популярные направления</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trending.map((name) => {
              const city = allCities.find(c => c.name === name)!;
              return (
                <button
                  key={name}
                  onClick={() => setSelected(city)}
                  className="glass-card p-4 rounded-xl flex items-center gap-3 hover:bg-white/8 transition-all active:scale-95 text-left"
                >
                  <span className="text-3xl">{city.icon}</span>
                  <div>
                    <div className="text-white font-semibold text-sm">{city.name}</div>
                    <div className="text-white/50 text-xs">{city.temp}°</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No results */}
      {query.length > 1 && filtered.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-white/60 font-medium">Город не найден</div>
          <div className="text-white/30 text-sm mt-1">Попробуй другое название</div>
        </div>
      )}
    </div>
  );
}
