import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useWeather, owmIconToEmoji, countryFlag } from "@/hooks/useWeather";

const FAVORITE_CITIES = ["Москва", "Санкт-Петербург", "Сочи", "Казань", "Екатеринбург"];

interface WeatherHomeProps {
  onCityChange?: (city: string) => void;
}

export default function WeatherHome({ onCityChange }: WeatherHomeProps) {
  const { currentWeather, loading, error, fetchCurrent } = useWeather();
  const [currentCity, setCurrentCity] = useState("Москва");
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchCurrent({ city: "Москва" });
    setTimeout(() => setLoaded(true), 100);
  }, []);

  const detectLocation = () => {
    setIsLocating(true);
    setLocationError("");
    if (!navigator.geolocation) {
      setLocationError("Геолокация недоступна в этом браузере");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const data = await fetchCurrent({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        if (data) {
          setCurrentCity(data.city);
          onCityChange?.(data.city);
        }
        setIsLocating(false);
      },
      () => {
        setLocationError("Нет доступа к геолокации");
        setIsLocating(false);
      }
    );
  };

  const handleCitySwitch = (city: string) => {
    setCurrentCity(city);
    fetchCurrent({ city });
    onCityChange?.(city);
  };

  const w = currentWeather;
  const emoji = owmIconToEmoji(w?.icon_code || "");

  const bgGradient = () => {
    if (!w) return "from-slate-800 to-blue-900";
    const code = (w.icon_code || "").replace("d", "").replace("n", "");
    if (["01"].includes(code)) return "from-orange-600 to-yellow-500";
    if (["02", "03"].includes(code)) return "from-blue-700 to-sky-600";
    if (["04"].includes(code)) return "from-slate-700 to-slate-600";
    if (["09", "10"].includes(code)) return "from-blue-900 to-slate-800";
    if (["11"].includes(code)) return "from-slate-900 to-purple-900";
    if (["13"].includes(code)) return "from-blue-950 to-indigo-900";
    return "from-slate-800 to-blue-900";
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6">
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 animate-fade-in ${loaded ? "opacity-100" : "opacity-0"}`}>
        <div>
          <h1 className="font-unbounded text-xl font-bold text-white">
            {w ? `${w.city}${w.country ? ` ${countryFlag(w.country)}` : ""}` : currentCity}
          </h1>
          <p className="text-white/50 text-sm mt-0.5">
            {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button
          onClick={detectLocation}
          disabled={isLocating || loading}
          className="flex items-center gap-2 glass-card px-3 py-2 rounded-xl text-sm text-sky-400 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-60"
        >
          {isLocating ? (
            <span className="inline-block animate-spin text-base">⟳</span>
          ) : (
            <Icon name="LocateFixed" size={16} />
          )}
          <span className="font-medium">{isLocating ? "Поиск..." : "Моё место"}</span>
        </button>
      </div>

      {(locationError || error) && (
        <div className="mb-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {locationError || error}
        </div>
      )}

      {/* Main Card */}
      <div className={`relative overflow-hidden rounded-2xl p-6 mb-4 animate-slide-up stagger-1 bg-gradient-to-br ${bgGradient()}`}>
        <div className="absolute inset-0 opacity-20"
          style={{ background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15), transparent 60%)" }} />
        <div className="relative z-10">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-5xl animate-spin">⟳</div>
            </div>
          ) : w ? (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-8xl font-unbounded font-black text-white leading-none">{w.temp}°</div>
                  <div className="text-white/80 mt-2 text-lg capitalize">{w.condition}</div>
                  <div className="text-white/50 text-sm mt-1">Ощущается как {w.feels_like}°</div>
                </div>
                <div className="text-7xl animate-float select-none">{emoji}</div>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Icon name="Droplets" size={14} />
                  <span>{w.humidity}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Icon name="Wind" size={14} />
                  <span>{w.wind_speed} км/ч {w.wind_dir}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Icon name="Eye" size={14} />
                  <span>{w.visibility} км</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-white/40 text-center py-6">Нет данных</div>
          )}
        </div>
      </div>

      {/* Detail cards */}
      {w && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-slide-up stagger-2">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Gauge" size={14} className="text-purple-400" />
              <span className="text-white/50 text-xs">Давление</span>
            </div>
            <div className="text-white font-bold text-lg">{w.pressure}</div>
            <div className="text-white/40 text-xs">мм рт. ст.</div>
          </div>
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Sunrise" size={14} className="text-orange-400" />
              <span className="text-white/50 text-xs">Восход / Закат</span>
            </div>
            <div className="text-white font-bold text-sm">
              {new Date(w.sunrise * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
              {" / "}
              {new Date(w.sunset * 1000).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-white/40 text-xs mt-1">по местному времени</div>
          </div>
        </div>
      )}

      {/* City switcher */}
      <div className="glass-card p-4 animate-slide-up stagger-3">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="MapPin" size={14} className="text-sky-400" />
          <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Избранные города</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAVORITE_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => handleCitySwitch(city)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 disabled:opacity-50 ${
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
