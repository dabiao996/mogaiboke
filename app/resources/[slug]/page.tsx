import Link from "next/link";
import { notFound } from "next/navigation";

import Navbar from "../../../components/Navbar";
import PageTransition from "../../../components/PageTransition";
import { getAllResources, getResourceBySlug } from "../../../lib/resources";

export function generateStaticParams() {
  return getAllResources().map((resource) => ({ slug: resource.slug }));
}

export default function ResourceDetailPage({ params }: { params: { slug: string } }) {
  const resource = getResourceBySlug(params.slug);
  if (!resource) notFound();

  return (
    <div className="shell-page min-h-screen pb-14">
      <Navbar />
      <PageTransition>
        <main className="mx-auto mt-24 w-[min(960px,calc(100%-24px))] sm:mt-28">
          <article className="glass-panel-strong overflow-hidden p-6">
            {resource.cover ? <img src={resource.cover} alt={resource.name} className="h-[260px] w-full rounded-[28px] object-cover" /> : null}
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <span>{resource.type}</span>
              <span>·</span>
              <span>{resource.category}</span>
              {typeof resource.rating === "number" ? (
                <>
                  <span>·</span>
                  <span>{resource.rating}/5</span>
                </>
              ) : null}
            </div>
            <h1 className="mt-3 text-4xl font-black text-slate-900 dark:text-white">{resource.name}</h1>
            <p className="mt-4 text-[15px] leading-8 text-slate-700 dark:text-slate-200">{resource.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {resource.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[rgba(214,107,77,0.1)] px-3 py-1 text-xs font-semibold text-[var(--accent-deep)] dark:text-[var(--accent-soft)]">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={resource.link} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-[0_16px_30px_rgba(214,107,77,0.24)]">
                打开外部链接
              </a>
              <Link href="/resources" className="rounded-full border border-white/50 bg-white/75 px-5 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100">
                返回资源页
              </Link>
            </div>
          </article>
        </main>
      </PageTransition>
    </div>
  );
}
