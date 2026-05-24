"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface Post {
  slug: string;
  title?: string;
  description?: string;
  tags?: string[];
  date?: string;
  [key: string]: any;
}

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function Highlight({ text = "", query = "" }: { text?: string; query?: string }) {
  if (!query.trim() || !text) return <>{text}</>;

  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = String(text).split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="rounded-md bg-[rgba(214,107,77,0.16)] px-1 py-0.5 font-bold text-[var(--accent-deep)] dark:bg-[rgba(242,154,110,0.16)] dark:text-[var(--accent-soft)]"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export default function SearchBar({ posts = [] }: { posts: Post[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return posts.filter((post) => {
      const titleMatch = (post.title || "").toLowerCase().includes(query);
      const descriptionMatch = (post.description || "").toLowerCase().includes(query);
      const tagMatch = (post.tags || []).some((tag) => tag.toLowerCase().includes(query));
      return titleMatch || descriptionMatch || tagMatch;
    });
  }, [posts, searchQuery]);

  return (
    <div ref={containerRef} className="relative z-[100] mx-auto mb-10 w-full max-w-4xl">
      <form className="glass-panel-strong relative overflow-hidden p-2" onSubmit={(event) => event.preventDefault()}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-6 text-slate-400 dark:text-slate-500">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索标题、摘要或标签"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-[24px] bg-white/55 py-4 pl-14 pr-5 text-base font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </form>

      <AnimatePresence>
        {isOpen && searchQuery.trim() ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.985 }}
            transition={{ duration: 0.18 }}
            className="glass-panel-strong absolute inset-x-0 top-full mt-4 max-h-[460px] overflow-y-auto"
          >
            {searchResults.length > 0 ? (
              <div className="p-3">
                {searchResults.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/articles/${post.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-[24px] px-4 py-4 hover:bg-white/60 dark:hover:bg-white/5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        <Highlight text={post.title} query={searchQuery} />
                      </h4>
                      {post.date ? (
                        <span className="rounded-full border border-white/50 bg-white/70 px-3 py-1 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                          {post.date.split(" ")[0]}
                        </span>
                      ) : null}
                    </div>

                    {post.description ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        <Highlight text={post.description} query={searchQuery} />
                      </p>
                    ) : null}

                    {post.tags?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/45 bg-white/68 px-3 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                          >
                            <Highlight text={tag} query={searchQuery} />
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                  没有找到与 <span className="text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">{searchQuery}</span> 相关的内容
                </div>
                <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">可以试试标题关键词、标签或者摘要里的短语。</p>
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
