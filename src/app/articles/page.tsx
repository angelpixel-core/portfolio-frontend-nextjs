"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
import { useArticles } from "@/hooks";
import { FeaturedArticleCard } from "@/organisms";
import { ArticleListItem } from "@/molecules";
import { ArticleAppearance, ArticleHoverThumbnail } from "@/atoms";
import MotionTitle from "@/atoms/texts/AnimatedTitle/MotionTitle";
import ArticleListSkeleton from "./ArticleListSkeleton";
import type { Article } from "@/domains/article/model/schema";
import "./styles.css";

/** State for hover thumbnail display */
interface HoverState {
  article: Article;
  rect: DOMRect;
}

function ArticlesContent() {
  const { data: articles = [], isLoading, isError } = useArticles();

  // Story 14.8: Hover thumbnail state
  const [hoverState, setHoverState] = useState<HoverState | null>(null);

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

  /**
   * Story 14.8: Handle hover state changes from ArticleListItem
   * Creates a closure to capture the article for each list item
   */
  const createHoverHandler = useCallback(
    (article: Article) => (isHovered: boolean, rect: DOMRect | null) => {
      if (isHovered && rect) {
        setHoverState({ article, rect });
      } else {
        setHoverState(null);
      }
    },
    []
  );

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
      {/* Story 14.8: Hover thumbnail integration */}
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
                <ArticleListItem
                  article={article}
                  onHoverChange={createHoverHandler(article)}
                />
              </ArticleAppearance>
            ))}
          </div>
        </section>
      )}

      {/* Story 14.8: Hover thumbnail popup */}
      <ArticleHoverThumbnail
        article={hoverState?.article ?? null}
        rect={hoverState?.rect ?? null}
      />
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
