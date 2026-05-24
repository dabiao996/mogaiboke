import { ResourceBrowser } from "./resources-client";
import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import { getAllResources } from "../../lib/resources";

export const metadata = {
  title: "资源",
  description: "学习资料、工具、网站和教程资源整理。",
};

export default function ResourcesPage() {
  const resources = getAllResources();

  return (
    <div className="shell-page min-h-screen pb-14">
      <Navbar />
      <PageTransition>
        <main className="mx-auto mt-24 w-[min(1200px,calc(100%-24px))] sm:mt-28">
          <section className="glass-panel-strong mb-6 p-6">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Resources</div>
            <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white">资源页</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              把学习资料、工具、教程和常用网站统一放在这里，支持搜索、分类和标签筛选，也可以在列表与网格两种方式之间切换。
            </p>
          </section>
          <ResourceBrowser resources={resources} />
        </main>
      </PageTransition>
    </div>
  );
}
