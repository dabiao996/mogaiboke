"use client";

import { useEffect, useState } from "react";
import { useMusic } from "./MusicProvider";

const waveBars = [0, 120, 260, 180, 320];

export default function LyricBar() {
  const { isPlaying, currentLyric, currentSong } = useMusic();
  const [displayedLyric, setDisplayedLyric] = useState("");

  useEffect(() => {
    let index = 0;
    const target = currentLyric || "";
    setDisplayedLyric("");
    if (!target) return;

    const timer = setInterval(() => {
      if (index <= target.length) {
        setDisplayedLyric(target.slice(0, index));
        index += 1;
      } else {
        clearInterval(timer);
      }
    }, 36);

    return () => clearInterval(timer);
  }, [currentLyric]);

  if (!currentSong) return null;

  return (
    <section className="glass-panel relative overflow-hidden px-5 py-5 sm:px-6">
      <style>{`
        @keyframes lyricWave {
          0%, 100% { height: 8px; opacity: 0.45; }
          50% { height: 28px; opacity: 1; }
        }
        @keyframes lyricCursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(214,107,77,0.08),transparent,rgba(182,212,255,0.12))] dark:bg-[linear-gradient(90deg,rgba(242,154,110,0.07),transparent,rgba(93,111,167,0.12))]" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="hidden items-end gap-1 sm:flex">
          {waveBars.map((delay) => (
            <span
              key={delay}
              className={`w-1.5 rounded-full ${isPlaying ? "bg-[var(--accent)]" : "bg-slate-400/50 dark:bg-slate-600"}`}
              style={{
                height: isPlaying ? undefined : "8px",
                animation: isPlaying ? `lyricWave 1s ease-in-out ${delay}ms infinite` : undefined,
              }}
            />
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
            Live lyric
          </div>
          <p className="mt-2 truncate text-sm font-semibold text-slate-700 dark:text-slate-200 sm:text-base">
            {displayedLyric || "歌词会跟着当前播放的音乐在这里滚动。"}
            <span
              className="ml-1 inline-block h-4 w-[2px] align-[-2px] bg-[var(--accent)]"
              style={{ animation: "lyricCursor 0.9s step-end infinite" }}
            />
          </p>
        </div>

        <div className="rounded-full border border-white/50 bg-white/68 px-3 py-2 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/6 dark:text-slate-300">
          {isPlaying ? "播放中" : "已暂停"}
        </div>
      </div>
    </section>
  );
}
