import Link from "next/link";

import Navbar from "../components/Navbar";
import PageTransition from "../components/PageTransition";
import { ToastProvider } from "../components/ToastProvider";
import { siteConfig } from "../siteConfig";
import { getAllArticles, getArticleTags } from "../lib/articles";
import { getAllResources } from "../lib/resources";
import { getAllShuoshuo } from "../lib/shuoshuo";
import HomeCalendar from "../components/home/HomeCalendar";
import MiniMusicWidget from "../components/home/MiniMusicWidget";

export default function Home() {
  const articles = getAllArticles();
  const resources = getAllResources();
  const shuoshuo = getAllShuoshuo();
  const tags = getArticleTags(articles).slice(0, 10);
  const categoryMap = new Map<string, number>();

  articles.forEach((article) => {
    if (!article.category) return;
    categoryMap.set(article.category, (categoryMap.get(article.category) || 0) + 1);
  });

  const categories = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const totalWords = articles.reduce((sum, article) => sum + (article.description?.length || 0), 0);
  const recentActivities = [
    ...articles.slice(0, 4).map((article) => ({ type: "文章", title: article.title, date: article.formattedDate, href: `/articles/${article.slug}` })),
    ...shuoshuo.slice(0, 3).map((item) => ({ type: "说说", title: item.content, date: item.formattedDate, href: "/shuoshuo" })),
  ]
    .sort((a, b) => new Date(b.date.replace(/\./g, "/")).getTime() - new Date(a.date.replace(/\./g, "/")).getTime())
    .slice(0, 6);

  return (
    <ToastProvider>
      <div className="shell-page min-h-screen pb-12">
        <Navbar />
        <PageTransition>
          <main className="relative z-10 mx-auto mt-24 w-[min(1280px,calc(100%-24px))] sm:mt-28">
            <div className="grid gap-6 xl:grid-cols-[290px,minmax(0,1fr),300px]">
              <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
                <section className="glass-panel-strong overflow-hidden p-5">
                  <div className="flex items-start gap-4">
                    <img src={siteConfig.avatarUrl} alt={siteConfig.authorName} className="h-20 w-20 rounded-[24px] object-cover shadow-sm" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">Profile</div>
                      <h1 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{siteConfig.authorName}</h1>
                      <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{siteConfig.bio}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      { label: "GitHub", href: siteConfig.social?.github },
                      { label: "Gitee", href: siteConfig.social?.gitee },
                      { label: "邮箱", href: siteConfig.social?.google },
                    ].map((item) => (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                        {item.label}
                      </a>
                    ))}
                  </div>
                </section>

                <section className="glass-panel-strong p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Notice</div>
                  <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">公告</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    这里会慢慢堆积文章、资源和日常记录。首页不再用大 Hero，而是回到更适合个人博客长期阅读的三栏结构。
                  </p>
                  <Link href="/about" className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-bold text-white shadow-[0_16px_30px_rgba(214,107,77,0.24)]">
                    了解更多
                  </Link>
                </section>

                <section className="glass-panel-strong p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Tags</div>
                  <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">标签</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag.name} className="rounded-full border border-white/50 bg-white/70 px-3 py-1.5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </section>

                <section className="glass-panel-strong p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Categories</div>
                  <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">分类</h3>
                  <div className="mt-4 space-y-2">
                    {categories.map((category) => (
                      <div key={category.name} className="flex items-center justify-between rounded-[18px] border border-white/45 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{category.name}</span>
                        <span className="rounded-full bg-[rgba(214,107,77,0.12)] px-3 py-1 text-xs font-bold text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </aside>

              <section className="min-w-0 space-y-5">
                <section className="glass-panel-strong p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Latest Articles</div>
                      <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">最新文章</h2>
                    </div>
                    <Link href="/articles" className="rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                      查看全部
                    </Link>
                  </div>
                </section>

                <div className="space-y-4">
                  {articles.slice(0, 8).map((article) => (
                    <article key={article.slug} className="glass-panel-strong overflow-hidden p-4 sm:p-5">
                      <div className="grid gap-4 md:grid-cols-[200px,minmax(0,1fr)]">
                        <Link href={`/articles/${article.slug}`} className="block overflow-hidden rounded-[24px] bg-white/70">
                          <img src={article.cover} alt={article.title} className="h-full min-h-[150px] w-full object-cover transition duration-300 hover:scale-105" />
                        </Link>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                            <span>{article.formattedDate}</span>
                            {article.category ? <span>· {article.category}</span> : null}
                            <span>· {article.tags.length} 个标签</span>
                          </div>
                          <Link href={`/articles/${article.slug}`} className="mt-2 block text-2xl font-black leading-tight text-slate-900 dark:text-white">
                            {article.title}
                          </Link>
                          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{article.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {article.tags.slice(0, 4).map((tag) => (
                              <span key={tag} className="rounded-full bg-[rgba(214,107,77,0.1)] px-3 py-1 text-xs font-semibold text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
                <section className="glass-panel-strong p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Stats</div>
                  <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">站点统计</h3>
                  <div className="mt-4 space-y-3">
                    <StatRow label="文章" value={articles.length} />
                    <StatRow label="分类" value={categories.length} />
                    <StatRow label="标签" value={tags.length} />
                    <StatRow label="资源" value={resources.length} />
                    <StatRow label="说说" value={shuoshuo.length} />
                    <StatRow label="摘要字数" value={totalWords} />
                  </div>
                </section>

                <HomeCalendar />

                <section className="glass-panel-strong p-5">
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Recent Activity</div>
                  <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">最近活动</h3>
                  <div className="mt-4 space-y-3">
                    {recentActivities.map((item, index) => (
                      <Link key={`${item.type}-${index}`} href={item.href} className="block rounded-[18px] border border-white/45 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                        <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">{item.type}</div>
                        <div className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">{item.title}</div>
                        <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">{item.date}</div>
                      </Link>
                    ))}
                  </div>
                </section>

                <MiniMusicWidget />
              </aside>
            </div>
          </main>
        </PageTransition>
      </div>
    </ToastProvider>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-[18px] border border-white/45 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      <span className="text-sm font-black text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}
