import { useState } from "react";
import Icon from "@/components/ui/icon";
import WeatherHome from "@/components/WeatherHome";
import WeatherSearch from "@/components/WeatherSearch";
import WeatherForecast from "@/components/WeatherForecast";
import WeatherNotifications from "@/components/WeatherNotifications";
import WeatherSettings from "@/components/WeatherSettings";

type Tab = "home" | "search" | "forecast" | "notifications" | "settings";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "search", label: "Поиск", icon: "Search" },
  { id: "forecast", label: "Прогноз", icon: "CalendarDays" },
  { id: "notifications", label: "Оповещения", icon: "Bell" },
  { id: "settings", label: "Настройки", icon: "Settings" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [unreadCount] = useState(2);

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(199 100% 55%), transparent 70%)" }}
        />
        <div
          className="absolute top-1/2 -left-20 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, hsl(272 80% 65%), transparent 70%)" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col pt-10 relative z-10">
        {activeTab === "home" && <WeatherHome />}
        {activeTab === "search" && <WeatherSearch />}
        {activeTab === "forecast" && <WeatherForecast />}
        {activeTab === "notifications" && <WeatherNotifications />}
        {activeTab === "settings" && <WeatherSettings />}
      </div>

      {/* Bottom nav */}
      <div className="sticky bottom-0 z-20">
        <div
          className="mx-3 mb-3 rounded-2xl px-2 py-2"
          style={{
            background: "rgba(20, 25, 40, 0.85)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 -4px 40px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const hasNotif = tab.id === "notifications" && unreadCount > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 relative active:scale-90"
                  style={{
                    background: isActive ? "rgba(14,165,233,0.15)" : "transparent",
                  }}
                >
                  <div className="relative">
                    <Icon
                      name={tab.icon as "Home"}
                      size={20}
                      className={`transition-all duration-200 ${isActive ? "text-sky-400" : "text-white/30"}`}
                    />
                    {hasNotif && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-all duration-200 ${isActive ? "text-sky-400" : "text-white/25"}`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
