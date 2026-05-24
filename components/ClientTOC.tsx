"use client";

import { useEffect, useState } from "react";

type TocItem = {
  level: number;
  text: string;
  id: string;
};

export default function ClientTOC({ toc }: { toc: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const contentRoot = document.getElementById("article-content");
    if (!contentRoot) return;

    const headings = Array.from(contentRoot.querySelectorAll("h1, h2, h3"));
    headings.forEach((heading, index) => {
      const tocItem = toc[index];
      if (tocItem) {
        heading.id = tocItem.id;
      }
    });

    const handleScroll = () => {
      let currentId = "";
      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= 140) {
          currentId = heading.id;
        }
      });
      setActiveId(currentId);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toc]);

  if (!toc.length) return null;

  return (
    <div className="glass-panel p-6">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
        Table of contents
      </h3>
      <nav className="relative flex flex-col gap-2">
        <div className="absolute bottom-0 left-0 top-0 w-px bg-slate-200 dark:bg-white/10" />
        {toc.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                const target = document.getElementById(item.id);
                if (!target) return;
                window.scrollTo({
                  top: target.getBoundingClientRect().top + window.scrollY - 96,
                  behavior: "smooth",
                });
              }}
              className={`relative pl-4 text-left text-sm leading-6 ${
                item.level === 2 ? "ml-3" : item.level === 3 ? "ml-6 text-[13px]" : ""
              } ${
                active
                  ? "font-bold text-[var(--accent-deep)] dark:text-[var(--accent-soft)]"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {active ? (
                <span className="absolute left-[-4px] top-2.5 h-2 w-2 rounded-full bg-[var(--accent)]" />
              ) : null}
              {item.text}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
