"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggleBlock() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="glass-panel-strong group flex h-full min-h-[240px] w-full flex-col justify-between overflow-hidden p-6 text-left sm:p-7"
    >
      <div className="section-kicker w-fit">{isDark ? "Night Mode" : "Day Mode"}</div>

      <div className="my-6 flex items-center justify-center">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/45 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(252,232,218,0.75))] shadow-[0_20px_44px_rgba(214,107,77,0.15)] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(29,38,49,0.95),rgba(14,20,28,0.9))]">
          <div
            className={`absolute inset-3 rounded-full transition duration-500 ${
              isDark
                ? "bg-[radial-gradient(circle_at_top,rgba(255,229,180,0.18),rgba(18,24,34,0.96))]"
                : "bg-[radial-gradient(circle_at_top,rgba(255,247,212,0.95),rgba(243,188,154,0.76))]"
            }`}
          />
          <div
            className={`relative z-10 text-5xl transition duration-500 ${
              isDark ? "translate-y-0 scale-100 opacity-100" : "-translate-y-1 scale-95 opacity-95"
            }`}
          >
            {isDark ? "☾" : "☀"}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {isDark ? "夜间阅读" : "白昼阅读"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {isDark
            ? "切到更安静的深色背景，适合晚上继续看代码和长文。"
            : "保持柔和暖色的页面氛围，阅读感更轻，层次也更清楚。"}
        </p>
      </div>
    </button>
  );
}
