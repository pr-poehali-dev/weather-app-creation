import { useState } from "react";
import Icon from "@/components/ui/icon";

const weekForecast = [
  { day: "Сегодня", date: "20 мар", icon: "☁️", high: 5, low: -1, condition: "Облачно", rain: 20, wind: 12 },
  { day: "Пятница", date: "21 мар", icon: "🌧️", high: 4, low: 1, condition: "Дождь", rain: 80, wind: 18 },
  { day: "Суббота", date: "22 мар", icon: "⛅", high: 7, low: 2, condition: "Переменная облачность", rain: 30, wind: 10 },
  { day: "Воскресенье", date: "23 мар", icon: "☀️", high: 10, low: 3, condition: "Ясно", rain: 5, wind: 7 },
  { day: "Понедельник", date: "24 мар", icon: "☀️", high: 12, low: 5, condition: "Солнечно", rain: 5, wind: 6 },
  { day: "Вторник", date: "25 мар", icon: "🌤️", high: 9, low: 3, condition: "Малооблачно", rain: 15, wind: 9 },
  { day: "Среда", date: "26 мар", icon: "🌨️", high: 2, low: -3, condition: "Снег", rain: 60, wind: 14 },
];

const tempRange = { min: -3, max: 12 };

export default function WeatherForecast() {
  const [selected, setSelected] = useState(0);
  const day = weekForecast[selected];

  const getBarWidth = (high: number, low: number) => {
    const rangeTotal = tempRange.max - tempRange.min;
    const left = ((low - tempRange.min) / rangeTotal) * 100;
    const width = ((high - low) / rangeTotal) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6">
      <div className="mb-6 animate-fade-in">
        <h1 className="font-unbounded text-xl font-bold text-white mb-1">Прогноз</h1>
        <p className="text-white/40 text-sm">Москва · 7 дней</p>
      </div>

      {/* Selected day detail */}
      <div className="relative overflow-hidden rounded-2xl p-5 mb-4 animate-slide-up stagger-1"
        style={{ background: "linear-gradient(135deg, hsl(220 60% 18%), hsl(240 50% 22%))" }}>
        <div className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 80% 20%, rgba(14,165,233,0.3), transparent 60%)" }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-white/50 text-sm font-medium mb-1">{day.date}</div>
              <div className="font-unbounded text-3xl font-black text-white">{day.high}° / {day.low}°</div>
              <div className="text-white/70 mt-1">{day.condition}</div>
            </div>
            <div className="text-6xl">{day.icon}</div>
          </div>
          <div className="flex gap-5 mt-4">
            <div className="flex items-center gap-1.5 text-white/60 text-sm">
              <Icon name="CloudRain" size={13} />
              <span>{day.rain}% осадки</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/60 text-sm">
              <Icon name="Wind" size={13} />
              <span>{day.wind} км/ч ветер</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week list */}
      <div className="glass-card rounded-2xl overflow-hidden animate-slide-up stagger-2">
        {weekForecast.map((item, i) => {
          const bar = getBarWidth(item.high, item.low);
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all hover:bg-white/5 ${i > 0 ? "border-t border-white/5" : ""} ${selected === i ? "bg-sky-500/10" : ""}`}
            >
              <div className="w-20 text-left">
                <div className={`font-medium text-sm ${selected === i ? "text-sky-400" : "text-white"}`}>{item.day}</div>
                <div className="text-white/30 text-xs">{item.date}</div>
              </div>
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1 mx-2">
                <div className="relative h-1.5 bg-white/10 rounded-full">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      ...bar,
                      background: "linear-gradient(90deg, hsl(var(--sky-blue)), hsl(var(--sky-orange)))"
                    }}
                  />
                </div>
                {item.rain > 40 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Icon name="Droplets" size={10} className="text-blue-400" />
                    <span className="text-blue-400 text-xs">{item.rain}%</span>
                  </div>
                )}
              </div>
              <div className="text-right min-w-[52px]">
                <span className="text-white font-semibold">{item.high}°</span>
                <span className="text-white/30 mx-1">/</span>
                <span className="text-white/50">{item.low}°</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 glass-card p-4 rounded-2xl animate-slide-up stagger-3">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="BarChart3" size={14} className="text-sky-400" />
          <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Сводка недели</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">🌡️</div>
            <div className="text-white font-bold">12°</div>
            <div className="text-white/40 text-xs">Макс.</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🧊</div>
            <div className="text-white font-bold">-3°</div>
            <div className="text-white/40 text-xs">Мин.</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🌧️</div>
            <div className="text-white font-bold">3 дня</div>
            <div className="text-white/40 text-xs">Осадки</div>
          </div>
        </div>
      </div>
    </div>
  );
}
