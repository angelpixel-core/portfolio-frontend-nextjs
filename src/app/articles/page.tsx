"use client";

import { Suspense, useMemo } from "react";
import { useArticles } from "@/hooks";
import { ArticleCard, FeaturedArticleCard } from "@/organisms";
import MotionTitle from "@/atoms/texts/AnimatedTitle/MotionTitle";
import ArticleListSkeleton from "./ArticleListSkeleton";
import "./styles.css";

function ArticlesContent() {
  const { data: articles = [], isLoading, isError } = useArticles();

  // Separate featured and non-featured articles (AC1, AC2)
  // Max 2 featured in hero blade; extras go to grid
  const { featuredArticles, gridArticles } = useMemo(() => {
    const featured = articles.filter((a) => a.featured);
    const nonFeatured = articles.filter((a) => !a.featured);
    // Only first 2 featured go to hero blade
    const heroFeatured = featured.slice(0, 2);
    // Extra featured (3rd+) plus all non-featured go to grid
    const extraFeatured = featured.slice(2);
    return {
      featuredArticles: heroFeatured,
      gridArticles: [...extraFeatured, ...nonFeatured],
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

      {/* Grid Blade: Non-featured + extra featured Articles (AC2) */}
      {gridArticles.length > 0 && (
        <section className="articles-blade articles-blade--grid">
          <div className="articles-grid">
            {gridArticles.map((article) => (
              <div key={article.slug} className="articles-grid__item">
                <ArticleCard article={article} />
              </div>
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
