export interface ShuoshuoItem {
  id: string;
  content: string;
  date: string;
  image?: string;
}

export const shuoshuoData: ShuoshuoItem[] = [
  {
    id: "note-20260524-01",
    content: "把博客重新整理成更适合长期记录的样子，首页、文章、资源和说说都会慢慢长成喜欢的模样。",
    date: "2026-05-24 21:10:00",
    image: "",
  },
  {
    id: "note-20260518-01",
    content: "最近在补网络、算法和分子模拟的学习笔记，顺手也把常用资料收进资源页里，之后查找会方便很多。",
    date: "2026-05-18 09:24:00",
  },
];
