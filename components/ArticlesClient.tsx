"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ArticleSummary } from "../lib/articles";

export default function ArticlesClient({
  articles,
  tags,
}: {
  articles: ArticleSummary[];
  tags: { name: string; count: number }[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("全部");

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesTag = activeTag === "全部" || article.tags.includes(activeTag);
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery) return matchesTag;
      const searchTarget = [article.title, article.description, article.category, article.tags.join(" ")].join(" ").toLowerCase();
      return matchesTag && searchTarget.includes(normalizedQuery);
    });
  }, [activeTag, articles, query]);

  return (
    <div className="mx-auto mt-24 w-[min(1160px,calc(100%-24px))] pb-14 sm:mt-28 lg:mt-32">
      <section className="mb-8 sm:mb-10">
        <div className="section-kicker">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          Articles
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr,0.92fr]">
          <div>
            <h1 className="text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl">
              文章主入口已经切到这里，适合长文、教程和慢慢整理过的记录。
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
              `/posts/[slug]` 仍然保留兼容，新入口统一使用 `/articles`。这页只展示公开文章，`draft: true` 不会出现在列表里，也不会参与静态生成。
            </p>
          </div>
          <div className="glass-panel-strong p-5">
            <div className="grid grid-cols-2 gap-3">
              <SummaryBox value={articles.length} label="公开文章" />
              <SummaryBox value={tags.length} label="活跃标签" />
            </div>
            <div className="mt-4 rounded-[24px] border border-white/45 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Reading note</div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                教程类文章会更突出目录、代码块和推荐阅读，适合连续阅读和回看。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-panel-strong mb-6 p-3 sm:p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr,auto] lg:items-center">
          <div className="flex flex-wrap gap-2">
            <TagButton active={activeTag === "全部"} label="全部" onClick={() => setActiveTag("全部")} />
            {tags.map((tag) => (
              <TagButton
                key={tag.name}
                active={activeTag === tag.name}
                label={`${tag.name} ${tag.count}`}
                onClick={() => setActiveTag(tag.name)}
              />
            ))}
          </div>
          <div className="relative min-w-0 lg:w-[320px]">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索文章标题、摘要或标签"
              className="w-full rounded-full border border-white/50 bg-white/70 px-4 py-3 pr-10 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {filteredArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="glass-panel-strong group overflow-hidden"
          >
            <div className="grid h-full gap-0 sm:grid-cols-[220px,1fr]">
              <div className="relative min-h-[180px] overflow-hidden">
                <img
                  src={article.cover}
                  alt={article.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-white backdrop-blur-md">
                  {article.formattedDate}
                </div>
              </div>
              <div className="flex flex-col justify-between p-5 sm:p-6">
                <div>
                  {article.category ? (
                    <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">
                      {article.category}
                    </div>
                  ) : null}
                  <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900 dark:text-white">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{article.description}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/45 bg-white/70 px-3 py-1 text-[11px] font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {filteredArticles.length === 0 ? (
        <div className="glass-panel mt-6 px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          没有找到符合当前筛选条件的文章，换个标签或关键词试试。
        </div>
      ) : null}
    </div>
  );
}

function SummaryBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[22px] border border-white/45 bg-white/58 px-4 py-4 dark:border-white/10 dark:bg-white/5">
      <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</div>
    </div>
  );
}

function TagButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        active
          ? "bg-[var(--accent)] text-white shadow-[0_14px_28px_rgba(214,107,77,0.22)]"
          : "border border-white/50 bg-white/70 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}
