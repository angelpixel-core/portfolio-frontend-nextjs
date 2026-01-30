"use client";

import { Suspense, useMemo } from "react";
import { useArticles } from "@/hooks";
import { FeaturedArticleCard } from "@/organisms";
import { ArticleListItem } from "@/molecules";
import { ArticleAppearance } from "@/atoms/motion";
import MotionTitle from "@/atoms/texts/AnimatedTitle/MotionTitle";
import ArticleListSkeleton from "./ArticleListSkeleton";
import "./styles.css";

function ArticlesContent() {
  const { data: articles = [], isLoading, isError } = useArticles();

  // Separate featured and non-featured articles (AC1, AC2)
  // Max 2 featured in hero blade; extras go to list
  const { featuredArticles, listArticles } = useMemo(() => {
    const featured = articles.filter((a) => a.featured);
    const nonFeatured = articles.filter((a) => !a.featured);
    // Only first 2 featured go to hero blade
    const heroFeatured = featured.slice(0, 2);
    // Extra featured (3rd+) plus all non-featured go to list
    const extraFeatured = featured.slice(2);
    return {
      featuredArticles: heroFeatured,
      listArticles: [...extraFeatured, ...nonFeatured],
    };
  }, [articles]);

  if (isLoading) {
    return <ArticleListSkeleton />;
  }

  if (isError || !articles.length) {
    return (
      <div className="articles-page">
        <p className="articles-empty">No articles available.</p>
      </div>
    );
  }

  const title = "Thoughts & Insights";

  return (
    <div className="articles-page">
      {/* Hero Blade: Title + Featured Articles (AC1) */}
      <section className="articles-blade articles-blade--hero">
        <MotionTitle title={title} className="articles-title" />

        {featuredArticles.length > 0 && (
          <div className="articles-blade__featured">
            {featuredArticles.map((article) => (
              <FeaturedArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* All Articles Blade: List format (Story 14.10) */}
      {/* Story 14.7: Sequential appearance for list articles */}
      {listArticles.length > 0 && (
        <section className="articles-blade articles-blade--list">
          <h2 className="articles-list__heading">All Articles</h2>
          <div className="articles-list">
            {listArticles.map((article, index) => (
              <ArticleAppearance
                key={article.slug}
                id={article.slug}
                index={index}
                className="articles-list__item"
              >
                <ArticleListItem article={article} />
              </ArticleAppearance>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<ArticleListSkeleton />}>
      <ArticlesContent />
    </Suspense>
  );
}
