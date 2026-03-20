import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function WeatherSettings() {
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [windUnit, setWindUnit] = useState<"kmh" | "ms">("kmh");
  const [theme, setTheme] = useState<"dark" | "auto">("dark");
  const [lang, setLang] = useState("ru");
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [widgets, setWidgets] = useState(false);

  const Section = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <div className="glass-card rounded-2xl overflow-hidden mb-4">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <Icon name={icon as "Settings"} size={14} className="text-sky-400" />
        <span className="text-white/60 text-xs uppercase tracking-wider font-medium">{title}</span>
      </div>
      {children}
    </div>
  );

  const Toggle = ({ label, sub, value, onChange }: { label: string; sub?: string; value: boolean; onChange: () => void }) => (
    <div className="flex items-center gap-3 px-4 py-3.5 border-t border-white/5 first:border-0">
      <div className="flex-1">
        <div className="text-white/80 text-sm">{label}</div>
        {sub && <div className="text-white/30 text-xs mt-0.5">{sub}</div>}
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? "bg-sky-500" : "bg-white/10"}`}
      >
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${value ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );

  const SegmentControl = ({ value, options, onChange }: {
    value: string;
    options: { value: string; label: string }[];
    onChange: (v: string) => void;
  }) => (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${value === opt.value ? "bg-sky-500 text-white" : "text-white/50 hover:text-white"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 pb-6">
      <div className="mb-6 animate-fade-in">
        <h1 className="font-unbounded text-xl font-bold text-white mb-1">Настройки</h1>
        <p className="text-white/40 text-sm">Персонализируй приложение</p>
      </div>

      {/* Units */}
      <div className="animate-slide-up stagger-1">
        <Section title="Единицы измерения" icon="Ruler">
          <div className="p-4 space-y-4">
            <div>
              <div className="text-white/60 text-sm mb-2">Температура</div>
              <SegmentControl
                value={tempUnit}
                options={[{ value: "C", label: "°C Цельсий" }, { value: "F", label: "°F Фаренгейт" }]}
                onChange={(v) => setTempUnit(v as "C" | "F")}
              />
            </div>
            <div>
              <div className="text-white/60 text-sm mb-2">Скорость ветра</div>
              <SegmentControl
                value={windUnit}
                options={[{ value: "kmh", label: "км/ч" }, { value: "ms", label: "м/с" }]}
                onChange={(v) => setWindUnit(v as "kmh" | "ms")}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Appearance */}
      <div className="animate-slide-up stagger-2">
        <Section title="Внешний вид" icon="Palette">
          <div className="p-4 space-y-4">
            <div>
              <div className="text-white/60 text-sm mb-2">Тема</div>
              <SegmentControl
                value={theme}
                options={[{ value: "dark", label: "🌙 Тёмная" }, { value: "auto", label: "⚡ Авто" }]}
                onChange={(v) => setTheme(v as "dark" | "auto")}
              />
            </div>
            <div>
              <div className="text-white/60 text-sm mb-2">Язык</div>
              <SegmentControl
                value={lang}
                options={[{ value: "ru", label: "🇷🇺 Русский" }, { value: "en", label: "🇬🇧 English" }]}
                onChange={setLang}
              />
            </div>
          </div>
        </Section>
      </div>

      {/* Permissions */}
      <div className="animate-slide-up stagger-3">
        <Section title="Разрешения" icon="Shield">
          <Toggle label="Уведомления о погоде" sub="Предупреждения об опасных явлениях" value={notifications} onChange={() => setNotifications(p => !p)} />
          <Toggle label="Геолокация" sub="Для автоматического определения города" value={location} onChange={() => setLocation(p => !p)} />
          <Toggle label="Виджет на экране" sub="Отображение на главном экране" value={widgets} onChange={() => setWidgets(p => !p)} />
        </Section>
      </div>

      {/* About */}
      <div className="animate-slide-up stagger-4">
        <div className="glass-card rounded-2xl p-5 text-center">
          <div className="text-4xl mb-3">🌤️</div>
          <div className="font-unbounded font-bold text-white text-base mb-1">СкайПульс</div>
          <div className="text-white/40 text-sm mb-4">Версия 1.0.0</div>
          <div className="text-white/30 text-xs">Данные обновляются каждые 30 минут</div>
        </div>
      </div>
    </div>
  );
}
