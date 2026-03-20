import { useState } from "react";
import Icon from "@/components/ui/icon";

const notifications = [
  {
    id: 1,
    type: "warning",
    icon: "⚡",
    title: "Гроза ожидается",
    message: "Завтра с 14:00 до 18:00 возможна гроза в Москве. Рекомендуем взять зонт.",
    time: "2 часа назад",
    read: false,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    id: 2,
    type: "info",
    icon: "❄️",
    title: "Сильные морозы",
    message: "Ночью температура опустится до -15°C. Одевайтесь теплее!",
    time: "5 часов назад",
    read: false,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: 3,
    type: "success",
    icon: "☀️",
    title: "Потепление на выходных",
    message: "В выходные дни ожидается солнечная погода до +12°C. Отличное время для прогулок!",
    time: "Вчера",
    read: true,
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    id: 4,
    type: "info",
    icon: "💨",
    title: "Порывистый ветер",
    message: "Ветер усилится до 25 км/ч, порывы до 40 км/ч. Возможны затруднения в движении.",
    time: "2 дня назад",
    read: true,
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
];

const alertRules = [
  { label: "Гроза и молния", icon: "⚡", enabled: true },
  { label: "Сильный ветер", icon: "💨", enabled: true },
  { label: "Снегопад", icon: "❄️", enabled: false },
  { label: "Сильная жара", icon: "🌡️", enabled: true },
  { label: "Туман", icon: "🌫️", enabled: false },
  { label: "Ежедневный прогноз", icon: "📅", enabled: true },
];

export default function WeatherNotifications() {
  const [rules, setRules] = useState(alertRules);
  const [notes, setNotes] = useState(notifications);

  const toggleRule = (i: number) => {
    setRules(prev => prev.map((r, idx) => idx === i ? { ...r, enabled: !r.enabled } : r));
  };

  const markRead = (id: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notes.filter(n => !n.read).length;

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6">
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="font-unbounded text-xl font-bold text-white mb-1">Уведомления</h1>
          <p className="text-white/40 text-sm">
            {unreadCount > 0 ? `${unreadCount} непрочитанных` : "Всё прочитано"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => setNotes(prev => prev.map(n => ({ ...n, read: true })))}
            className="text-sky-400 text-sm font-medium hover:text-sky-300 transition-colors"
          >
            Прочитать все
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3 mb-6 animate-slide-up stagger-1">
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => markRead(note.id)}
            className={`w-full text-left p-4 rounded-2xl border transition-all active:scale-98 ${note.read ? "glass-card opacity-60" : `${note.bg} border`}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">{note.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-semibold text-sm ${note.read ? "text-white/70" : "text-white"}`}>{note.title}</span>
                  {!note.read && <span className="w-2 h-2 rounded-full bg-sky-400 flex-shrink-0" />}
                </div>
                <p className="text-white/50 text-sm leading-relaxed">{note.message}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Icon name="Clock" size={11} className="text-white/30" />
                  <span className="text-white/30 text-xs">{note.time}</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Alert rules */}
      <div className="glass-card rounded-2xl overflow-hidden animate-slide-up stagger-2">
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Icon name="Bell" size={14} className="text-sky-400" />
            <span className="text-white/60 text-xs uppercase tracking-wider font-medium">Настройка оповещений</span>
          </div>
        </div>
        {rules.map((rule, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-white/5" : ""}`}
          >
            <span className="text-xl">{rule.icon}</span>
            <span className="text-white/80 text-sm flex-1">{rule.label}</span>
            <button
              onClick={() => toggleRule(i)}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${rule.enabled ? "bg-sky-500" : "bg-white/10"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${rule.enabled ? "left-6" : "left-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
