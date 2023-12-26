import { fetchArticles, fetchFeaturedArticles } from "@/data/articles";

import Article from "@/organisms/articles/article";
import FeaturedArticle from "@/organisms/articles/featured-article";

export default async function Page() {
  const featuredArticles = await fetchFeaturedArticles();
  const articles = await fetchArticles();

  return (
    <>
      <ul
        className="
          grid
          grid-cols-2 md:grid-cols-1
          gap-16 lg:gap-8 md:gap-y-16
        "
      >
        {featuredArticles.map(({ title, img, summary, time, link }, index) => (
          <FeaturedArticle
            key={index}
            title={title}
            img={img}
            summary={summary}
            time={time}
            link={link}
          />
        ))}
      </ul>

      <h2
        className="
          w-full
          my-16 mt-32
          text-4xl
          text-center
          font-bold
          dark:text-light
        "
      >
        All Articles
      </h2>

      <ul>
        {articles.map(({ title, img, date, link }, index) => (
          <Article
            key={index}
            title={title}
            img={img}
            date={date}
            link={link}
          />
        ))}
      </ul>
    </>
  );
}
