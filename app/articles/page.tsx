import Navbar from "../../components/Navbar";
import PageTransition from "../../components/PageTransition";
import ArticlesClient from "../../components/ArticlesClient";
import { getAllArticles, getArticleTags } from "../../lib/articles";
import { siteConfig } from "../../siteConfig";

export const metadata = {
  title: `文章 | ${siteConfig.title}`,
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const tags = getArticleTags(articles);

  return (
    <div className="shell-page min-h-screen">
      <Navbar />
      <PageTransition>
        <ArticlesClient articles={articles} tags={tags} />
      </PageTransition>
    </div>
  );
}
