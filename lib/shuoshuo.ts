import { shuoshuoData, type ShuoshuoItem } from "../data/shuoshuo";

export type ShuoshuoSummary = ShuoshuoItem & {
  formattedDate: string;
};

export function formatShuoshuoDate(dateString: string) {
  if (!dateString) return "刚刚";
  const date = new Date(dateString.replace(/-/g, "/"));
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getAllShuoshuo() {
  return [...shuoshuoData]
    .map((item) => ({
      ...item,
      formattedDate: formatShuoshuoDate(item.date),
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRecentShuoshuo(limit = 4): ShuoshuoSummary[] {
  return getAllShuoshuo().slice(0, limit);
}
