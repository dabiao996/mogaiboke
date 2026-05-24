import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import { siteConfig } from "../siteConfig";

export type TocItem = {
  level: number;
  text: string;
  id: string;
};

export type ArticleSummary = {
  slug: string;
  title: string;
  date: string;
  formattedDate: string;
  description: string;
  cover: string;
  tags: string[];
  category: string;
  draft: boolean;
};

export type ArticleDetail = ArticleSummary & {
  content: string;
  contentHtml: string;
  toc: TocItem[];
};

const postsDirectory = path.join(process.cwd(), "posts");

export function formatArticleDate(dateString: string) {
  if (!dateString || dateString === "1970-01-01") return "刚刚更新";
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    if (hours === "00" && minutes === "00") return `${year}.${month}.${day}`;
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
}

function normalizeMarkdown(content: string) {
  let normalized = content.replace(/^(\s*\d+)\.([^ \n])/gm, "$1. $2");
  normalized = normalized.replace(/\r\n/g, "\n").replace(/^[ \t]+$/gm, "");

  const blocks = normalized.split(/(```[\s\S]*?```)/g);
  return blocks
    .map((block, index) => {
      if (index % 2 === 1) return block;
      return block.replace(/\n{3,}/g, (match) => {
        const brCount = match.length - 2;
        return "\n\n" + "<br/>".repeat(brCount) + "\n\n";
      });
    })
    .join("");
}

function cleanHeadingText(rawText: string) {
  return rawText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[*_~`#]/g, "")
    .trim();
}

export function getHeadingId(rawText: string) {
  const cleaned = cleanHeadingText(rawText);
  return `toc-${cleaned.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, "").toLowerCase()}`;
}

function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = cleanHeadingText(match[2].trim());
    toc.push({
      level: match[1].length,
      text,
      id: getHeadingId(text),
    });
  }

  return toc;
}

function readAllMarkdownFiles() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith(".md"));
}

function createSummary(fileName: string): ArticleSummary {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const rawDate = data.date || "1970-01-01";

  return {
    slug,
    title: data.title || slug,
    date: rawDate,
    formattedDate: formatArticleDate(rawDate),
    description: data.description || content.slice(0, 140),
    cover: data.cover || siteConfig.defaultPostCover,
    tags: Array.isArray(data.tags) ? data.tags : [],
    category: data.category || "",
    draft: data.draft === true,
  };
}

export function getAllArticles(options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? false;
  return readAllMarkdownFiles()
    .map(createSummary)
    .filter((article) => includeDrafts || !article.draft)
    .sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return b.slug.localeCompare(a.slug);
    });
}

export function getArticleSlugs() {
  return getAllArticles().map((article) => article.slug);
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  if (data.draft === true) return null;

  const normalizedContent = normalizeMarkdown(content);
  const contentHtml = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    // @ts-ignore
    .use(rehypeHighlight, {
      detect: true,
      ignoreMissing: true,
      subset: ["cpp", "c", "python", "java", "javascript", "typescript", "go", "rust", "bash", "json", "html", "css", "sql", "xml"],
    })
    .use(rehypeKatex)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(normalizedContent);

  const rawDate = data.date || "1970-01-01";

  return {
    slug,
    title: data.title || slug,
    date: rawDate,
    formattedDate: formatArticleDate(rawDate),
    description: data.description || content.slice(0, 140),
    cover: data.cover || siteConfig.defaultPostCover,
    tags: Array.isArray(data.tags) ? data.tags : [],
    category: data.category || "",
    draft: false,
    content,
    contentHtml: contentHtml.toString(),
    toc: extractToc(normalizedContent),
  };
}

export function getRecommendedArticles(currentSlug: string, limit = 3) {
  const articles = getAllArticles();
  const currentArticle = articles.find((article) => article.slug === currentSlug);
  if (!currentArticle) return articles.slice(0, limit);

  return articles
    .filter((article) => article.slug !== currentSlug)
    .map((article) => {
      let score = 0;
      if (currentArticle.category && article.category === currentArticle.category) score += 3;
      const sharedTags = article.tags.filter((tag) => currentArticle.tags.includes(tag)).length;
      score += sharedTags * 2;
      score += Math.max(0, 1 - Math.abs(new Date(article.date).getTime() - new Date(currentArticle.date).getTime()) / (1000 * 60 * 60 * 24 * 365));
      return { article, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}

export function getArticleTags(articles: ArticleSummary[]) {
  const counts: Record<string, number> = {};
  articles.forEach((article) => {
    article.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });

  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
