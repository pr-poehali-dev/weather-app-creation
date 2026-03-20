import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { useWeather, owmIconToEmoji } from "@/hooks/useWeather";

const CITIES = ["Москва", "Санкт-Петербург", "Сочи", "Казань", "Екатеринбург"];

export default function WeatherForecast() {
  const { forecast, loading, fetchForecast } = useWeather();
  const [selectedDay, setSelectedDay] = useState(0);
  const [city, setCity] = useState("Москва");

  useEffect(() => {
    fetchForecast({ city: "Москва" });
  }, []);

  const handleCityChange = (c: string) => {
    setCity(c);
    setSelectedDay(0);
    fetchForecast({ city: c });
  };

  const day = forecast[selectedDay];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "short" });
  };

  const getDayLabel = (dateStr: string, i: number) => {
    if (i === 0) return "Сегодня";
    if (i === 1) return "Завтра";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", { weekday: "short" });
  };

  const allTemps = forecast.flatMap(f => [f.temp_high, f.temp_low]);
  const minTemp = allTemps.length ? Math.min(...allTemps) : -10;
  const maxTemp = allTemps.length ? Math.max(...allTemps) : 15;

  const getBarStyle = (high: number, low: number) => {
    const range = maxTemp - minTemp || 1;
    const left = ((low - minTemp) / range) * 100;
    const width = ((high - low) / range) * 100;
    return { left: `${left}%`, width: `${Math.max(width, 8)}%` };
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6">
      <div className="mb-4 animate-fade-in">
        <h1 className="font-unbounded text-xl font-bold text-white mb-1">Прогноз</h1>
        <p className="text-white/40 text-sm">На 5 дней вперёд</p>
      </div>

      {/* City switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-4 animate-slide-up stagger-1">
        {CITIES.map((c) => (
          <button
            key={c}
            onClick={() => handleCityChange(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              city === c ? "bg-sky-500 text-white" : "glass-card text-white/50 hover:text-white border border-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Selected day detail */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-4xl animate-spin">⟳</div>
      ) : day ? (
        <>
          <div className="relative overflow-hidden rounded-2xl p-5 mb-4 animate-slide-up stagger-2"
            style={{ background: "linear-gradient(135deg, hsl(220 60% 18%), hsl(240 50% 22%))" }}>
            <div className="absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(circle at 80% 20%, rgba(14,165,233,0.3), transparent 60%)" }} />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-white/50 text-sm font-medium mb-1 capitalize">{formatDate(day.date)}</div>
                  <div className="font-unbounded text-3xl font-black text-white">{day.temp_high}° / {day.temp_low}°</div>
                  <div className="text-white/70 mt-1 capitalize">{day.condition}</div>
                </div>
                <div className="text-6xl">{owmIconToEmoji(day.icon_code)}</div>
              </div>
              <div className="flex gap-5 mt-4">
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <Icon name="CloudRain" size={13} />
                  <span>{day.rain_prob}% осадки</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60 text-sm">
                  <Icon name="Wind" size={13} />
                  <span>{day.wind_speed} км/ч ветер</span>
                </div>
              </div>
            </div>
          </div>

          {/* Week list */}
          <div className="glass-card rounded-2xl overflow-hidden animate-slide-up stagger-3">
            {forecast.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/5 ${i > 0 ? "border-t border-white/5" : ""} ${selectedDay === i ? "bg-sky-500/10" : ""}`}
              >
                <div className="w-20 text-left">
                  <div className={`font-medium text-sm ${selectedDay === i ? "text-sky-400" : "text-white"}`}>
                    {getDayLabel(item.date, i)}
                  </div>
                  <div className="text-white/30 text-xs">
                    {new Date(item.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short" })}
                  </div>
                </div>
                <span className="text-2xl">{owmIconToEmoji(item.icon_code)}</span>
                <div className="flex-1 mx-2">
                  <div className="relative h-1.5 bg-white/10 rounded-full">
                    <div
                      className="absolute h-full rounded-full"
                      style={{
                        ...getBarStyle(item.temp_high, item.temp_low),
                        background: "linear-gradient(90deg, #38bdf8, #fb923c)"
                      }}
                    />
                  </div>
                  {item.rain_prob > 40 && (
                    <div className="flex items-center gap-1 mt-1">
                      <Icon name="Droplets" size={10} className="text-blue-400" />
                      <span className="text-blue-400 text-xs">{item.rain_prob}%</span>
                    </div>
                  )}
                </div>
                <div className="text-right min-w-[56px]">
                  <span className="text-white font-semibold">{item.temp_high}°</span>
                  <span className="text-white/30 mx-1">/</span>
                  <span className="text-white/50">{item.temp_low}°</span>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-white/30">Нет данных прогноза</div>
      )}
    </div>
  );
}
