"use client";

import { useMemo, useState } from "react";

export default function HomeCalendar() {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const { label, days, blanks, today } = useMemo(() => {
    const now = new Date();
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    return {
      label: `${year}年${month + 1}月`,
      days: Array.from({ length: lastDay.getDate() }, (_, index) => index + 1),
      blanks: (firstDay.getDay() + 6) % 7,
      today: now.getFullYear() === year && now.getMonth() === month ? now.getDate() : -1,
    };
  }, [cursor]);

  return (
    <section className="glass-panel-strong overflow-hidden p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Calendar</div>
          <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">{label}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 dark:text-slate-500">
        {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-sm">
        {Array.from({ length: blanks }).map((_, index) => (
          <div key={`blank-${index}`} className="h-10 rounded-2xl" />
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`flex h-10 items-center justify-center rounded-2xl border ${
              day === today
                ? "border-[var(--accent)] bg-[rgba(214,107,77,0.14)] font-black text-[var(--accent-deep)] dark:text-[var(--accent-soft)]"
                : "border-transparent bg-white/50 text-slate-700 dark:bg-white/5 dark:text-slate-200"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </section>
  );
}
