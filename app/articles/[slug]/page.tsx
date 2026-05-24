import Link from "next/link";
import { notFound } from "next/navigation";
import "highlight.js/styles/atom-one-dark.css";

import Navbar from "../../../components/Navbar";
import PageTransition from "../../../components/PageTransition";
import BackButton from "../../../components/BackButton";
import Comments from "../../../components/Comments";
import ClientSocials from "../../../components/ClientSocials";
import ClientTOC from "../../../components/ClientTOC";
import SidebarLyric from "../../../components/SidebarLyric";
import { getArticleBySlug, getArticleSlugs, getRecommendedArticles } from "../../../lib/articles";
import { siteConfig } from "../../../siteConfig";

export async function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return { title: `未找到文章 | ${siteConfig.title}` };
  }
  return {
    title: `${article.title} | ${siteConfig.title}`,
    description: article.description,
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const recommendedArticles = getRecommendedArticles(slug, 3);

  return (
    <div className="shell-page min-h-screen pb-20">
      <Navbar />
      <PageTransition>
        <main className="mx-auto mt-24 flex w-[min(1220px,calc(100%-24px))] flex-col gap-6 lg:mt-28 lg:flex-row lg:gap-8">
          <article className="glass-panel-strong min-w-0 flex-1 overflow-hidden">
            <div className="relative aspect-[16/7] overflow-hidden bg-slate-200 dark:bg-slate-800">
              <img src={article.cover} alt={article.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
                {article.category ? (
                  <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">{article.category}</div>
                ) : null}
                <h1 className="max-w-4xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  {article.title}
                </h1>
              </div>
            </div>

            <div className="p-5 sm:p-7 lg:p-10">
              <BackButton />

              <header className="mb-8 border-b border-white/40 pb-6 dark:border-white/10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/45 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                    发布时间 {article.formattedDate}
                  </span>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/45 bg-white/70 px-3 py-1 text-xs font-semibold text-[var(--accent-deep)] dark:border-white/10 dark:bg-white/5 dark:text-[var(--accent-soft)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
                  {article.description}
                </p>
              </header>

              <div
                id="article-content"
                className="article-prose prose prose-slate max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />

              <section className="mt-10 border-t border-white/40 pt-8 dark:border-white/10">
                <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">
                  Continue reading
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {recommendedArticles.map((recommended) => (
                    <Link
                      key={recommended.slug}
                      href={`/articles/${recommended.slug}`}
                      className="rounded-[24px] border border-white/45 bg-white/62 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="text-[11px] font-semibold tracking-[0.14em] text-slate-400 dark:text-slate-500">
                        {recommended.formattedDate}
                      </div>
                      <div className="mt-2 text-lg font-black text-slate-900 dark:text-white">{recommended.title}</div>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {recommended.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              <div className="mt-12">
                <Comments />
              </div>
            </div>
          </article>

          <aside className="w-full flex-shrink-0 lg:w-[320px]">
            <div className="flex flex-col gap-5 lg:sticky lg:top-28">
              <div className="glass-panel p-6 text-center">
                <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-white/50 bg-white/80 p-1 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <img src={siteConfig.avatarUrl} alt={siteConfig.authorName} className="h-full w-full rounded-full object-cover" />
                </div>
                <h3 className="mt-4 text-xl font-black text-slate-900 dark:text-white">{siteConfig.authorName}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{siteConfig.bio}</p>
                <div className="mt-4">
                  <ClientSocials />
                </div>
              </div>

              <SidebarLyric />

              {article.toc.length > 0 ? <ClientTOC toc={article.toc} /> : null}
            </div>
          </aside>
        </main>
      </PageTransition>
    </div>
  );
}
