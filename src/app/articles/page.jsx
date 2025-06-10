import { Article } from "@/models/_index";

import { Article as DefaultArticle, FeaturedArticle } from "@/molecules/_index";

export default async function ArticlesPage() {
  const subtitle = "All Articles";

  const articles = await Article.all();

  return (
    <>
      <h2>ArticlesPage</h2>
      <ul className="articles-content--feat">
        {articles
          .filter((article) => !!article.featured)
          .map((article, index) => (
            <FeaturedArticle key={index} props={article} />
          ))}
      </ul>

      <h3 className="article-subtitle">{subtitle}</h3>
      <ul className="articles-content">
        {articles
          .filter((article) => !article.featured)
          .map((article, index) => (
            <DefaultArticle key={index} props={article} />
          ))}
      </ul>
    </>
  );
}
