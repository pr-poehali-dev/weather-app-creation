import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const weatherData: Record<string, {
  temp: number;
  feels: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: string;
  uv: number;
  visibility: number;
  pressure: number;
  bg: string;
}> = {
  "Москва": { temp: 3, feels: -2, humidity: 78, wind: 12, condition: "Облачно", icon: "☁️", uv: 2, visibility: 10, pressure: 760, bg: "from-slate-800 to-blue-900" },
  "Санкт-Петербург": { temp: 1, feels: -4, humidity: 85, wind: 15, condition: "Снег", icon: "❄️", uv: 1, visibility: 5, pressure: 755, bg: "from-blue-900 to-indigo-900" },
  "Сочи": { temp: 18, feels: 16, humidity: 65, wind: 8, condition: "Ясно", icon: "☀️", uv: 7, visibility: 20, pressure: 765, bg: "from-orange-700 to-yellow-600" },
  "Казань": { temp: -5, feels: -11, humidity: 72, wind: 18, condition: "Мороз", icon: "🥶", uv: 1, visibility: 8, pressure: 762, bg: "from-indigo-900 to-slate-900" },
  "Екатеринбург": { temp: -8, feels: -14, humidity: 68, wind: 10, condition: "Снегопад", icon: "🌨️", uv: 1, visibility: 4, pressure: 758, bg: "from-blue-950 to-slate-800" },
};

const hourlyForecast = [
  { time: "Сейчас", icon: "☁️", temp: 3 },
  { time: "13:00", icon: "🌤️", temp: 5 },
  { time: "14:00", icon: "☀️", temp: 7 },
  { time: "15:00", icon: "☀️", temp: 8 },
  { time: "16:00", icon: "🌤️", temp: 6 },
  { time: "17:00", icon: "☁️", temp: 4 },
  { time: "18:00", icon: "🌧️", temp: 2 },
];

interface WeatherHomeProps {
  onCityChange?: (city: string) => void;
}

export default function WeatherHome({ onCityChange }: WeatherHomeProps) {
  const [currentCity, setCurrentCity] = useState("Москва");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const weather = weatherData[currentCity] ?? weatherData["Москва"];

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const detectLocation = () => {
    setIsLocating(true);
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Геолокация недоступна");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setTimeout(() => {
          setCurrentCity("Москва");
          setIsLocating(false);
          onCityChange?.("Москва");
        }, 1200);
      },
      () => {
        setLocationError("Нет доступа к геолокации");
        setIsLocating(false);
      }
    );
  };

  const handleCitySwitch = (city: string) => {
    setCurrentCity(city);
    onCityChange?.(city);
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6">
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 animate-fade-in ${loaded ? "opacity-100" : "opacity-0"}`}>
        <div>
          <h1 className="font-unbounded text-xl font-bold text-white">{currentCity}</h1>
          <p className="text-white/50 text-sm mt-0.5">
            {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button
          onClick={detectLocation}
          disabled={isLocating}
          className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl text-sm text-sky-400 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-60"
        >
          {isLocating ? (
            <span className="animate-spin text-base">⟳</span>
          ) : (
            <Icon name="LocateFixed" size={16} />
          )}
          <span className="font-medium">{isLocating ? "Поиск..." : "Моё место"}</span>
        </button>
      </div>

      {locationError && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {locationError}
        </div>
      )}

      {/* Main Card */}
      <div className={`relative overflow-hidden rounded-2xl p-6 mb-4 animate-slide-up stagger-1 bg-gradient-to-br ${weather.bg}`}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15), transparent 60%)" }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-8xl font-unbounded font-black text-white leading-none">
                {weather.temp}°
              </div>
              <div className="text-white/70 mt-2 text-lg">{weather.condition}</div>
              <div className="text-white/50 text-sm mt-1">Ощущается как {weather.feels}°</div>
            </div>
            <div className="text-7xl animate-float select-none">{weather.icon}</div>
          </div>

          {/* Mini stats */}
          <div className="flex gap-4 mt-6">
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <Icon name="Droplets" size={14} />
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <Icon name="Wind" size={14} />
              <span>{weather.wind} км/ч</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <Icon name="Eye" size={14} />
              <span>{weather.visibility} км</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly forecast */}
      <div className="glass-card p-4 mb-4 animate-slide-up stagger-2">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Clock" size={14} className="text-sky-400" />
          <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Почасовой прогноз</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {hourlyForecast.map((h, i) => (
            <div key={i} className={`flex flex-col items-center gap-2 min-w-[52px] py-2 px-2 rounded-xl transition-all ${i === 0 ? "bg-sky-500/20 border border-sky-500/30" : "hover:bg-white/5"}`}>
              <span className="text-white/50 text-xs font-medium">{h.time}</span>
              <span className="text-2xl">{h.icon}</span>
              <span className="text-white font-semibold text-sm">{h.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-2 gap-3 mb-4 animate-slide-up stagger-3">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Gauge" size={14} className="text-purple-400" />
            <span className="text-white/50 text-xs">Давление</span>
          </div>
          <div className="text-white font-bold text-lg">{weather.pressure}</div>
          <div className="text-white/40 text-xs">мм рт. ст.</div>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Sun" size={14} className="text-yellow-400" />
            <span className="text-white/50 text-xs">УФ-индекс</span>
          </div>
          <div className="text-white font-bold text-lg">{weather.uv}</div>
          <div className="text-white/40 text-xs">{weather.uv <= 2 ? "Низкий" : weather.uv <= 5 ? "Умеренный" : "Высокий"}</div>
        </div>
      </div>

      {/* City switcher */}
      <div className="glass-card p-4 animate-slide-up stagger-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="MapPin" size={14} className="text-sky-400" />
          <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Избранные города</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(weatherData).map((city) => (
            <button
              key={city}
              onClick={() => handleCitySwitch(city)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                currentCity === city
                  ? "bg-sky-500 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
