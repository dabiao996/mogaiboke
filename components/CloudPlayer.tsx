"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMusic } from "./MusicProvider";

const formatTime = (time: number) => {
  if (!time || Number.isNaN(time)) return "00:00";
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function CloudPlayer() {
  const router = useRouter();
  const {
    playlist,
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    currentLyric,
    isLoading,
    togglePlay,
    nextSong,
    prevSong,
    handleSeek,
  } = useMusic();
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
    }, 38);

    return () => clearInterval(timer);
  }, [currentLyric]);

  if (isLoading) {
    return (
      <section className="glass-panel-strong flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
        <div className="h-11 w-11 rounded-full border-4 border-[var(--accent)] border-t-transparent animate-spin" />
        <p className="mt-5 text-xs font-black uppercase tracking-[0.28em] text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">
          Connecting Music
        </p>
      </section>
    );
  }

  if (!currentSong || playlist.length === 0) {
    return (
      <section className="glass-panel-strong flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/50 bg-white/65 text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">
          <svg className="h-9 w-9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
        </div>
        <p className="mt-5 text-base font-bold text-slate-700 dark:text-slate-200">音乐列表暂时还是空的</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">可以先去后台确认网易云单曲 ID 是否已经同步。</p>
      </section>
    );
  }

  const stop = (event: React.SyntheticEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <section
      onClick={() => router.push("/music")}
      className="glass-panel-strong group relative flex min-h-[320px] cursor-pointer flex-col overflow-hidden p-6 sm:p-7"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,107,77,0.24),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(102,126,234,0.16),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(242,154,110,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(92,115,173,0.18),transparent_28%)]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className="section-kicker">Now Playing</div>
          <h2 className="mt-4 text-2xl font-black text-slate-900 dark:text-white">音乐卡片</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            保留原来的播放控制，把视觉整理得更轻一点，也更适合桌面和手机一起看。
          </p>
        </div>
        <div className="hidden rounded-full border border-white/50 bg-white/60 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 sm:block">
          {isPlaying ? "LIVE" : "PAUSED"}
        </div>
      </div>

      <div className="relative z-10 mt-7 flex items-center gap-5">
        <div
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/60 bg-white/80 p-1 shadow-lg dark:border-white/10 dark:bg-white/5"
          style={{
            animation: isPlaying ? "spin 9s linear infinite" : undefined,
          }}
        >
          <img
            src={currentSong.cover}
            alt={currentSong.title}
            className="h-full w-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-[38%] rounded-full border border-white/70 bg-white/80 dark:border-white/10 dark:bg-slate-900/90" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-2xl font-black text-slate-900 dark:text-white">{currentSong.title}</h3>
          <p className="mt-1 truncate text-sm font-medium tracking-[0.08em] text-slate-500 dark:text-slate-400">
            {currentSong.artist}
          </p>
          <p className="mt-3 min-h-[48px] text-sm leading-6 text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">
            {displayedLyric || "点击进入音乐页，继续播放当前这一首。"}
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-auto pt-8">
        <div
          className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-300"
          onClick={stop}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(event) => {
              stop(event);
              handleSeek(event);
            }}
            className="h-2 flex-1 appearance-none rounded-full bg-white/70 outline-none dark:bg-white/8"
            style={{
              background: `linear-gradient(to right, var(--accent) ${progress}%, rgba(148,163,184,0.3) ${progress}%)`,
            }}
          />
          <span className="w-10">{formatTime(duration)}</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4">
          <PlayerButton
            label="上一首"
            onClick={(event) => {
              stop(event);
              prevSong();
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </PlayerButton>
          <PlayerButton
            label={isPlaying ? "暂停" : "播放"}
            prominent
            onClick={(event) => {
              stop(event);
              togglePlay();
            }}
          >
            {isPlaying ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </PlayerButton>
          <PlayerButton
            label="下一首"
            onClick={(event) => {
              stop(event);
              nextSong();
            }}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18 14.5 12 6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </PlayerButton>
        </div>
      </div>
    </section>
  );
}

function PlayerButton({
  children,
  label,
  prominent = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  prominent?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        prominent
          ? "flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_16px_30px_rgba(214,107,77,0.32)] hover:scale-105"
          : "flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/72 text-slate-700 shadow-sm hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/6 dark:text-slate-100"
      }
    >
      {children}
    </button>
  );
}
