"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ResourceSummary } from "../../lib/resources";

export function ResourceBrowser({ resources }: { resources: ResourceSummary[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("全部");
  const [tag, setTag] = useState("全部");
  const [view, setView] = useState<"grid" | "list">("grid");

  const categories = useMemo(() => ["全部", ...Array.from(new Set(resources.map((item) => item.category)))], [resources]);
  const tags = useMemo(() => ["全部", ...Array.from(new Set(resources.flatMap((item) => item.tags)))], [resources]);

  const filtered = useMemo(
    () =>
      resources.filter((item) => {
        const hitQuery =
          !query ||
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.some((tagItem) => tagItem.toLowerCase().includes(query.toLowerCase()));
        const hitCategory = category === "全部" || item.category === category;
        const hitTag = tag === "全部" || item.tags.includes(tag);
        return hitQuery && hitCategory && hitTag;
      }),
    [resources, query, category, tag],
  );

  return (
    <section className="glass-panel-strong p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr,auto,auto] lg:items-center">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索资源名称、简介或标签..."
          className="w-full rounded-full border border-white/50 bg-white/70 px-4 py-3 text-sm text-slate-800 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
        />

        <div className="flex flex-wrap gap-2">
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-full border border-white/50 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={tag} onChange={(event) => setTag(event.target.value)} className="rounded-full border border-white/50 bg-white/70 px-4 py-3 text-sm text-slate-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button type="button" onClick={() => setView("grid")} className={`rounded-full px-4 py-3 text-sm font-semibold ${view === "grid" ? "bg-[var(--accent)] text-white" : "border border-white/50 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"}`}>
            网格
          </button>
          <button type="button" onClick={() => setView("list")} className={`rounded-full px-4 py-3 text-sm font-semibold ${view === "list" ? "bg-[var(--accent)] text-white" : "border border-white/50 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100"}`}>
            列表
          </button>
        </div>
      </div>

      <div className={view === "grid" ? "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" : "mt-6 space-y-4"}>
        {filtered.map((item) => (
          <article key={item.id} className={`rounded-[26px] border border-white/45 bg-white/62 p-4 shadow-sm dark:border-white/10 dark:bg-white/5 ${view === "list" ? "grid gap-4 md:grid-cols-[220px,minmax(0,1fr)]" : ""}`}>
            {item.cover ? <img src={item.cover} alt={item.name} className={`w-full rounded-[22px] object-cover ${view === "list" ? "h-full min-h-[150px]" : "h-40"}`} /> : null}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                <span>{item.type}</span>
                <span>·</span>
                <span>{item.category}</span>
                {item.recommended ? <span className="rounded-full bg-[rgba(214,107,77,0.12)] px-2 py-1 text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">推荐</span> : null}
              </div>
              <Link href={`/resources/${item.slug}`} className="mt-2 block text-xl font-black text-slate-900 dark:text-white">
                {item.name}
              </Link>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((resourceTag) => (
                  <button
                    key={resourceTag}
                    type="button"
                    onClick={() => setTag(resourceTag)}
                    className="rounded-full bg-[rgba(214,107,77,0.1)] px-3 py-1 text-xs font-semibold text-[var(--accent-deep)] dark:text-[var(--accent-soft)]"
                  >
                    #{resourceTag}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={`/resources/${item.slug}`} className="rounded-full border border-white/50 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                  查看详情
                </Link>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(214,107,77,0.24)]">
                  打开资源
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
