"use client";

import { useMusic } from "../MusicProvider";

export default function MiniMusicWidget() {
  const { currentSong, isPlaying, isLoading, togglePlay, nextSong } = useMusic();

  if (isLoading) {
    return (
      <section className="glass-panel-strong p-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Music</div>
        <div className="mt-4 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
          正在连接播放器...
        </div>
      </section>
    );
  }

  if (!currentSong) {
    return (
      <section className="glass-panel-strong p-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Music</div>
        <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">当前还没有可播放的歌曲，可以先去音乐页或后台检查歌单配置。</p>
      </section>
    );
  }

  return (
    <section className="glass-panel-strong p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Music</div>
          <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">播放小组件</h3>
        </div>
        <span className="rounded-full border border-white/50 bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {isPlaying ? "Playing" : "Paused"}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <img src={currentSong.cover} alt={currentSong.title} className="h-16 w-16 rounded-[20px] object-cover shadow-sm" referrerPolicy="no-referrer" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-black text-slate-900 dark:text-white">{currentSong.title}</div>
          <div className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">{currentSong.artist}</div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          className="flex flex-1 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-bold text-white shadow-[0_16px_30px_rgba(214,107,77,0.24)]"
        >
          {isPlaying ? "暂停" : "播放"}
        </button>
        <button
          type="button"
          onClick={nextSong}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        >
          ›
        </button>
      </div>
    </section>
  );
}
