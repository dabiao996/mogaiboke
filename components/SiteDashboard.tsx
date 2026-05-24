"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "../siteConfig";

export default function SiteDashboard() {
  const [timeStr, setTimeStr] = useState("");
  const [uptimeStr, setUptimeStr] = useState("");
  const startDate = new Date(siteConfig.buildDate || "2026-03-23T00:00:00").getTime();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );

      const diff = now.getTime() - startDate;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      setUptimeStr(`${days} 天 ${hours} 小时`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <section className="glass-panel-strong overflow-hidden">
      <div className="grid gap-4 p-4 md:grid-cols-[220px,1fr] md:p-5">
        <div className="rounded-[24px] bg-slate-950 px-6 py-5 text-white shadow-inner dark:bg-black">
          <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/55">Current time</div>
          <div className="mt-3 font-mono text-3xl font-black tracking-[0.18em]">{timeStr || "00:00:00"}</div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.25fr,1fr]">
          <div className="rounded-[24px] border border-white/45 bg-white/58 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Site status
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              博客已经稳定运行 <span className="text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">{uptimeStr}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              当前首页仍然沿用本地 Markdown 与原同步链路，Phase 2 只调整展示层，不改变发布方式。
            </p>
          </div>

          <div className="rounded-[24px] border border-white/45 bg-white/58 p-5 dark:border-white/10 dark:bg-white/5">
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
              Stack
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {siteConfig.footerBadges?.map((badge, index) => (
                <span
                  key={`${badge.name}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/76 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  <svg
                    className={`h-3.5 w-3.5 ${badge.color}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    dangerouslySetInnerHTML={{ __html: badge.svg }}
                  />
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {siteConfig.icpConfig ? (
        <div className="border-t border-white/40 px-5 py-4 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
          <a href={siteConfig.icpConfig.link} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-deep)] dark:hover:text-[var(--accent-soft)]">
            {siteConfig.icpConfig.name}
          </a>
        </div>
      ) : null}
    </section>
  );
}
