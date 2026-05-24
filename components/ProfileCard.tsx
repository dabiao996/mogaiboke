"use client";

import { useRouter } from "next/navigation";
import { siteConfig } from "../siteConfig";
import { useToast } from "./ToastProvider";

export default function ProfileCard({ postCount }: { postCount: number }) {
  const router = useRouter();
  const { showToast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    showToast(`${label} 已复制：${text}`, "success");
  };

  return (
    <section
      onClick={() => router.push("/about")}
      className="glass-panel-strong group relative flex min-h-[320px] cursor-pointer flex-col justify-between overflow-hidden p-6 sm:p-7 lg:p-9"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,176,144,0.26),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(182,212,255,0.2),transparent_34%)] opacity-80 dark:bg-[radial-gradient(circle_at_top_right,rgba(242,154,110,0.12),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(88,131,196,0.14),transparent_30%)]" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="section-kicker w-fit">
          <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
          Welcome
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="relative h-24 w-24 overflow-hidden rounded-[28px] border border-white/50 bg-white/80 p-1 shadow-lg dark:border-white/10 dark:bg-white/5">
            <img
              src={siteConfig.avatarUrl}
              alt={siteConfig.authorName}
              className="h-full w-full rounded-[22px] object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black leading-tight text-slate-900 dark:text-white sm:text-4xl">
              {siteConfig.authorName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-[15px]">
              {siteConfig.bio}
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard value={postCount} label="已发布文章" helper="持续积累中" />
          <StatCard value={6} label="常用渠道" helper="欢迎来找我" />
          <StatCard value={24} label="小时在线" helper="慢慢更新它" />
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          <SocialBtn type="GitHub" href={siteConfig.social?.github} />
          <SocialBtn type="Gitee" href={siteConfig.social?.gitee} />
          <SocialBtn type="Mail" href={siteConfig.social?.google} />
          <SocialBtn type="邮箱" onClick={() => copyToClipboard(siteConfig.social?.email || "", "邮箱")} />
          <SocialBtn type="QQ" onClick={() => copyToClipboard(siteConfig.social?.qq || "", "QQ")} />
          <SocialBtn type="微信" onClick={() => copyToClipboard(siteConfig.social?.wechat || "", "微信")} />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, helper }: { value: number; label: string; helper: string }) {
  return (
    <div className="rounded-[22px] border border-white/45 bg-white/58 px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/5">
      <div className="text-2xl font-black text-slate-900 dark:text-white">{value}</div>
      <div className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</div>
      <div className="mt-1 text-xs tracking-[0.12em] text-slate-400 dark:text-slate-500">{helper}</div>
    </div>
  );
}

function SocialBtn({
  type,
  href,
  onClick,
}: {
  type: string;
  href?: string;
  onClick?: () => void | Promise<void>;
}) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:-translate-y-0.5 hover:text-[var(--accent-deep)] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-[var(--accent-soft)]"
    >
      {type}
    </button>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        <span className="inline-flex rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:-translate-y-0.5 hover:text-[var(--accent-deep)] dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-[var(--accent-soft)]">
          {type}
        </span>
      </a>
    );
  }

  return button;
}
