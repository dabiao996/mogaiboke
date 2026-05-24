"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { siteConfig } from "../siteConfig";

type PlayMode = "loop" | "single" | "random";

interface MusicContextType {
  playlist: any[];
  currentIndex: number;
  currentSong: any;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  currentLyric: string;
  isLoading: boolean;
  volume: number;
  isMuted: boolean;
  playMode: PlayMode;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  playSong: (index: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  togglePlayMode: () => void;
}

const MusicContext = createContext<MusicContextType | null>(null);
const VOLUME_STORAGE_KEY = "xh-blog-music-volume";
const MUTE_STORAGE_KEY = "xh-blog-music-muted";

function parseLrc(lrcText: string) {
  if (!lrcText || lrcText.length > 30000) return [];
  const lines = lrcText.split(/\r?\n/);
  const result = [];

  for (const line of lines) {
    const matches = [...line.matchAll(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g)];
    if (!matches.length) continue;

    const text = line
      .replace(/\[\d{2,}:\d{2}(?:\.\d{2,3})?\]/g, "")
      .trim()
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "");

    if (!text) continue;

    for (const match of matches) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const ms = match[3] ? parseInt(match[3], 10) : 0;
      const divisor = match[3] && match[3].length === 3 ? 1000 : 100;
      result.push({ time: min * 60 + sec + ms / divisor, text });
    }
  }

  return result.sort((a, b) => a.time - b.time);
}

export function MusicProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const [currentLyric, setCurrentLyric] = useState("正在连接云端音乐...");
  const [isLoading, setIsLoading] = useState(true);
  const [volume, setVolumeState] = useState(0.82);
  const [isMuted, setIsMuted] = useState(false);
  const [playMode, setPlayMode] = useState<PlayMode>("loop");
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    try {
      const storedVolume = window.localStorage.getItem(VOLUME_STORAGE_KEY);
      const storedMuted = window.localStorage.getItem(MUTE_STORAGE_KEY);
      if (storedVolume) {
        const parsed = Number(storedVolume);
        if (!Number.isNaN(parsed)) {
          setVolumeState(Math.min(1, Math.max(0, parsed)));
        }
      }
      if (storedMuted) {
        setIsMuted(storedMuted === "true");
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
      window.localStorage.setItem(MUTE_STORAGE_KEY, String(isMuted));
    } catch {}
  }, [volume, isMuted]);

  useEffect(() => {
    let isMounted = true;
    const fetchMusicData = async () => {
      try {
        const fetchPromises = siteConfig.cloudMusicIds.map((id) =>
          fetch(`https://api.injahow.cn/meting/?server=netease&type=song&id=${id}`)
            .then((res) => res.json())
            .catch(() => null),
        );
        const results = await Promise.all(fetchPromises);

        const mergedPlaylist = results
          .filter((res) => res && res.length > 0)
          .map((res) => ({
            id: res[0].id || Math.random().toString(),
            title: res[0].name || res[0].title || "未知歌曲",
            artist: res[0].author || res[0].artist || "未知歌手",
            cover: res[0].pic || res[0].cover || "https://bu.dusays.com/2026/03/24/69c24230a5ff8.jpg",
            src: res[0].url,
            lrcUrl: res[0].lrc,
            lyrics: [],
          }))
          .filter((song) => song.src);

        if (!isMounted) return;
        if (mergedPlaylist.length > 0) {
          setPlaylist(mergedPlaylist);
        } else {
          setCurrentLyric("云端链路受阻");
        }
        setIsLoading(false);
      } catch {
        if (isMounted) {
          setCurrentLyric("网络初始化失败");
          setIsLoading(false);
        }
      }
    };

    if (siteConfig.cloudMusicIds?.length > 0) fetchMusicData();
    else setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!playlist.length) return;
    let isMounted = true;
    const currentSong = playlist[currentIndex];
    setLyrics([]);
    setCurrentLyric("正在缓冲...");

    if (currentSong?.lrcUrl) {
      fetch(currentSong.lrcUrl)
        .then((res) => res.text())
        .then((text) => {
          if (!isMounted) return;
          const parsed = parseLrc(text);
          setLyrics(parsed);
          setPlaylist((prev) => {
            const next = [...prev];
            if (next[currentIndex]) {
              next[currentIndex] = { ...next[currentIndex], lyrics: parsed };
            }
            return next;
          });
        })
        .catch(() => {
          if (isMounted) setCurrentLyric("纯享音乐");
        });
    } else {
      setCurrentLyric("纯享音乐");
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }

    return () => {
      isMounted = false;
    };
  }, [currentIndex, playlist.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const nextSong = () => {
    if (!playlist.length) return;
    if (playMode === "random") {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
      return;
    }
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevSong = () => {
    if (!playlist.length) return;
    if (playMode === "random") {
      setCurrentIndex(Math.floor(Math.random() * playlist.length));
      return;
    }
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const playSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime: nextTime, duration: nextDuration } = audioRef.current;
    setCurrentTime(nextTime);
    setDuration(nextDuration || 0);
    setProgress((nextTime / (nextDuration || 1)) * 100);

    if (lyrics.length > 0) {
      const activeLyric = lyrics.slice().reverse().find((line) => nextTime >= line.time);
      if (activeLyric && activeLyric.text !== currentLyric) {
        setCurrentLyric(activeLyric.text);
      }
    }
  };

  const handleEnded = () => {
    if (playMode === "single" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      return;
    }
    nextSong();
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextProgress = Number(event.target.value);
    setProgress(nextProgress);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (nextProgress / 100) * audioRef.current.duration;
    }
  };

  const setVolume = (value: number) => {
    const normalized = Math.min(1, Math.max(0, value));
    setVolumeState(normalized);
    if (isMuted && normalized > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const togglePlayMode = () => {
    setPlayMode((prev) => {
      if (prev === "loop") return "single";
      if (prev === "single") return "random";
      return "loop";
    });
  };

  const currentSong = playlist[currentIndex];

  return (
    <MusicContext.Provider
      value={{
        playlist,
        currentIndex,
        currentSong,
        isPlaying,
        progress,
        currentTime,
        duration,
        currentLyric,
        isLoading,
        volume,
        isMuted,
        playMode,
        togglePlay,
        nextSong,
        prevSong,
        handleSeek,
        playSong,
        setVolume,
        toggleMute,
        togglePlayMode,
      }}
    >
      {children}
      {currentSong ? (
        <audio
          ref={audioRef}
          src={currentSong.src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onLoadedMetadata={handleTimeUpdate}
        />
      ) : null}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within MusicProvider");
  return context;
};
