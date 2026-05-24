"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

interface PostPreview {
  slug: string;
  title: string;
  description: string;
  cover?: string;
  formattedDate?: string;
}

export default function LatestPostsCarousel({ posts }: { posts: PostPreview[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5200);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (!posts.length) return null;

  const currentPost = posts[currentIndex];
  const href = currentPost.slug === "none" ? "#" : `/articles/${currentPost.slug}`;

  return (
    <section className="glass-panel-strong relative min-h-[400px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPost.slug}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.985 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={currentPost.cover}
            alt={currentPost.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,16,13,0.1),rgba(19,16,13,0.72))]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full min-h-[400px] flex-col justify-between p-6 text-white sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="section-kicker bg-white/14 text-white backdrop-blur-md dark:bg-white/10 dark:text-white">
            Featured Post
          </div>
          {currentPost.formattedDate ? (
            <div className="rounded-full border border-white/20 bg-black/16 px-3 py-1 text-xs font-medium tracking-[0.14em] text-white/84 backdrop-blur-md">
              {currentPost.formattedDate}
            </div>
          ) : null}
        </div>

        <div className="mt-auto max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">Latest writing</div>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{currentPost.title}</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/78 sm:text-[15px]">
            {currentPost.description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link
              href={href}
              className={`rounded-full px-5 py-3 text-sm font-semibold shadow-lg ${
                currentPost.slug === "none"
                  ? "pointer-events-none bg-white/20 text-white/60"
                  : "bg-white text-slate-900 hover:-translate-y-0.5"
              }`}
            >
              {currentPost.slug === "none" ? "等待第一篇文章" : "进入阅读"}
            </Link>
            <span className="text-sm text-white/65">适合教程、笔记和慢慢读完的文章。</span>
          </div>
        </div>

        {posts.length > 1 ? (
          <div className="mt-8 flex items-center gap-2">
            {posts.map((post, index) => (
              <button
                key={post.slug}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-10 bg-white" : "w-3 bg-white/38 hover:bg-white/65"
                }`}
                aria-label={`切换到第 ${index + 1} 篇文章`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
