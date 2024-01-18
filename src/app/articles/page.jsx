// import article1 from "@/images/articles/pagination component in reactjs.jpg";
// import article2 from "@/images/articles/create loading screen in react js.jpg";
// import article3 from "@/images/articles/form validation in reactjs using custom react hook.png";
// import article4 from "@/images/articles/create modal component in react using react portals.png";
// import article5 from "@/images/articles/What is Redux with easy explanation.png";
// import article6 from "@/images/articles/What is higher order component in React.jpg";

import { fetchArticles } from "@/lib/data/_index";

import { Article, FeaturedArticle } from "@/molecules/articles/_index";

export default async function Page() {
  const subtitle = "All Articles";

  /*
  const [featArticles, articles] = await (async () => {
    const allArticles = await fetchArticles();

    return allArticles.reduce(
      ([featGroup, group], article) => {
        (article.featured ? featGroup : group).push(article);

        return [featGroup, group];
      },
      [[], []],
    );
  })();
*/
  return (
    <>
      <h3>ArticlesPage</h3>
      {/*
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
      */}
    </>
  );
}
