import { fetchArticles } from "@/lib/data/_index";
import { Article, FeaturedArticle } from "@/molecules/articles/_index";

export default async function Page() {
  const subtitle = "All Articles";

  const [featArticles, articles] = await (async () => {
    const allArticles = await fetchArticles();

    return allArticles.reduce(
      ([featGroup, group], article) => {
        (article.featured ? featGroup : group).push(article);

        return [featGroup, group];
      },
      [[], []]
    );
  })();
  return (
    <>
      <h3>ArticlesPage</h3>
      <ul className="articles-content--feat">
        {featArticles.map((article, index) => (
          <FeaturedArticle key={index} props={article} />
        ))}
      </ul>

      <h2 className="article-subtitle">{subtitle}</h2>

      <ul className="articles-content">
        {articles.map((article, index) => (
          <Article key={index} props={article} />
        ))}
      </ul>
    </>
  );
}
