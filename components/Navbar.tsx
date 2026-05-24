"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "../siteConfig";

const navLinks = [
  { name: "首页", href: "/" },
  { name: "文章", href: "/articles" },
  { name: "资源", href: "/resources" },
  { name: "说说", href: "/shuoshuo" },
  { name: "音乐", href: "/music" },
  { name: "友链", href: "/friends" },
  { name: "关于", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setShowNav(!(current > lastScrollY && current > 80));
      setLastScrollY(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header initial={false} animate={{ y: showNav ? 0 : -90, opacity: showNav ? 1 : 0.9 }} transition={{ duration: 0.35, ease: "easeOut" }} className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex w-[min(1260px,calc(100%-24px))] items-center justify-between rounded-b-[28px] border border-white/45 bg-[rgba(255,252,248,0.72)] px-4 py-3 shadow-[0_18px_45px_rgba(84,60,44,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-[rgba(12,18,25,0.72)] sm:px-6 lg:px-8">
          <Link href="/" className="group min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(244,176,144,0.95),rgba(214,107,77,0.95))] text-sm font-black text-white shadow-lg">
                XH
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-black uppercase tracking-[0.22em] text-slate-800 dark:text-slate-100">{siteConfig.navTitle}</div>
                <div className="truncate text-[11px] font-medium tracking-[0.18em] text-slate-500 dark:text-slate-400">
                  {siteConfig.navSuffix} / {siteConfig.navAfter}
                </div>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname === `${link.href}/`;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold tracking-[0.08em] ${
                    isActive
                      ? "bg-[rgba(214,107,77,0.16)] text-[var(--accent-deep)] dark:bg-[rgba(242,154,110,0.14)] dark:text-[var(--accent-soft)]"
                      : "text-slate-700 hover:bg-white/70 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/6 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/50 bg-white/65 text-slate-700 shadow-sm backdrop-blur md:hidden dark:border-white/10 dark:bg-white/6 dark:text-slate-100"
            aria-label="切换导航菜单"
          >
            <div className="flex flex-col gap-1">
              <span className={`h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 rounded-full bg-current transition ${isMobileMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm md:hidden" aria-label="关闭导航菜单" />
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.24, ease: "easeOut" }} className="fixed inset-x-3 top-[76px] z-[70] md:hidden">
              <div className="glass-panel-strong overflow-hidden p-3">
                <div className="mb-3 rounded-[24px] bg-[linear-gradient(135deg,rgba(255,248,240,0.8),rgba(247,226,213,0.45))] p-4 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">Navigation</div>
                  <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">围绕文章、资源和日常记录慢慢整理这个博客</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href || pathname === `${link.href}/`;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`rounded-[22px] px-4 py-4 text-sm font-semibold ${
                          isActive
                            ? "bg-[rgba(214,107,77,0.14)] text-[var(--accent-deep)] dark:bg-[rgba(242,154,110,0.14)] dark:text-[var(--accent-soft)]"
                            : "bg-white/60 text-slate-700 dark:bg-white/5 dark:text-slate-200"
                        }`}
                      >
                        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                          {link.href === "/" ? "home" : link.href.replace("/", "")}
                        </div>
                        <div className="mt-2 text-base font-black">{link.name}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
