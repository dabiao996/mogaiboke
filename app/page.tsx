import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import SearchBar from "../components/SearchBar";
import { siteConfig } from "../siteConfig";
import CloudPlayer from "../components/CloudPlayer";
import ThemeToggleBlock from "../components/ThemeToggleBlock";
import ProfileCard from "../components/ProfileCard";
import SiteDashboard from "../components/SiteDashboard";
import LyricBar from "../components/LyricBar";
import { ToastProvider } from "../components/ToastProvider";
import LatestPostsCarousel from "../components/LatestPostsCarousel";
import { getAllArticles } from "../lib/articles";

export default function Home() {
  const allPosts = getAllArticles();
  const topPosts =
    allPosts.length > 0
      ? allPosts.slice(0, 5)
      : [
          {
            slug: "none",
            title: "还没有新的文章",
            description: "下一篇正在路上，首页结构已经为它留好了位置。",
            cover: siteConfig.defaultPostCover,
            date: "",
            formattedDate: "",
            tags: [],
            category: "",
            draft: false,
          },
        ];

  return (
    <ToastProvider>
      <div className="shell-page min-h-screen pb-12">
        <Navbar />
        <PageTransition>
          <div className="relative z-10 mx-auto mt-24 w-[min(1160px,calc(100%-24px))] sm:mt-28 lg:mt-32">
            <section className="mb-8 px-1 sm:mb-10">
              <div className="section-kicker">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                Personal Blog
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr,0.8fr] lg:items-end">
                <div>
                  <h1 className="max-w-4xl text-4xl font-black leading-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                    给个人博客留一点呼吸感，也把内容留在真正好读的位置。
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
                    首页现在已经接到新的文章系统，公开文章统一从 `/articles` 进入，教程型内容也会在文章详情页里得到更完整的阅读结构。
                  </p>
                </div>
                <div className="glass-panel rounded-[28px] p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                    This week
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <HeroMetric value={allPosts.length} label="公开文章" />
                    <HeroMetric value={topPosts.filter((post) => post.slug !== "none").length} label="首页推荐" />
                  </div>
                </div>
              </div>
            </section>

            <SearchBar posts={allPosts} />

            <main className="flex flex-col gap-5 sm:gap-6">
              <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-7">
                  <ProfileCard postCount={allPosts.length} />
                </div>
                <div className="lg:col-span-5">
                  <CloudPlayer />
                </div>
              </div>

              <LyricBar />

              <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
                <div className="lg:col-span-8">
                  <LatestPostsCarousel posts={topPosts} />
                </div>
                <div className="lg:col-span-4">
                  <ThemeToggleBlock />
                </div>
              </div>

              <SiteDashboard />
            </main>
          </div>
        </PageTransition>
      </div>
    </ToastProvider>
  );
}

function HeroMetric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-[22px] border border-white/45 bg-white/58 px-4 py-4 dark:border-white/10 dark:bg-white/5">
      <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}</div>
    </div>
  );
}
