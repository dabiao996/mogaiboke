import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import { getAllShuoshuo } from "../../lib/shuoshuo";

export const metadata = {
  title: "说说",
  description: "短内容记录、日常片段和临时想法。",
};

export default function ShuoshuoPage() {
  const items = getAllShuoshuo();

  return (
    <div className="shell-page min-h-screen pb-14">
      <Navbar />
      <PageTransition>
        <main className="mx-auto mt-24 w-[min(980px,calc(100%-24px))] sm:mt-28">
          <section className="glass-panel-strong mb-6 p-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Shuoshuo</div>
            <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">说说</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              这里放一些不需要长篇展开的日常片段、学习进度和一闪而过的想法。只保留“说说”，不再混入杂谈或 Chatter。
            </p>
          </section>

          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.id} className="glass-panel-strong overflow-hidden p-5">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400 dark:text-slate-500">
                  <span>{item.formattedDate}</span>
                  <span>·</span>
                  <span>{item.image ? "带图片" : "纯文本"}</span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-[15px] leading-8 text-slate-700 dark:text-slate-200">{item.content}</p>
                {item.image ? <img src={item.image} alt="" className="mt-4 w-full rounded-[24px] object-cover" /> : null}
              </article>
            ))}
          </div>
        </main>
      </PageTransition>
    </div>
  );
}
