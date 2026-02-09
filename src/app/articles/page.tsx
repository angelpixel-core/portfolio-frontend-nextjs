"use client";

import { Suspense, useMemo, useState, useCallback } from "react";
import { useArticles } from "@/domains/article/queries";
import FeaturedArticlesCarousel from "@/molecules/FeaturedArticlesCarousel";
import ArticleListItem from "@/molecules/ArticleListItem";
import ArticleAppearance from "@/atoms/motion/ArticleAppearance";
import ArticleHoverThumbnail from "@/atoms/ArticleHoverThumbnail";
import MotionTitle from "@/atoms/texts/AnimatedTitle/MotionTitle";
import ArticleListSkeleton from "./ArticleListSkeleton";
import type { Article } from "@/domains/article/model/schema";
import "./styles.css";

/** Mouse position for cursor-following thumbnail */
interface MousePosition {
  x: number;
  y: number;
}

/** State for hover thumbnail display */
interface HoverState {
  article: Article;
  mousePosition: MousePosition;
}

function ArticlesContent() {
  const { data: articles = [], isLoading, isError } = useArticles();

  // Story 14.8: Hover thumbnail state with mouse position
  const [hoverState, setHoverState] = useState<HoverState | null>(null);

  // Separate featured and non-featured articles (AC1, AC2)
  // All featured articles go to carousel; non-featured go to list
  const { featuredArticles, listArticles } = useMemo(() => {
    const featured = articles.filter((a) => a.featured);
    const nonFeatured = articles.filter((a) => !a.featured);
    return {
      featuredArticles: featured,
      listArticles: nonFeatured,
    };
  }, [articles]);

  /**
   * Story 14.8: Handle hover state changes from ArticleListItem
   * Creates a closure to capture the article for each list item
   * Now receives mouse position instead of DOMRect for cursor-following behavior
   */
  const createHoverHandler = useCallback(
    (article: Article) =>
      (isHovered: boolean, mousePosition: MousePosition | null) => {
        if (isHovered && mousePosition) {
          setHoverState({ article, mousePosition });
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
      <div className="articles-page" data-testid="articles-page">
        <p className="articles-empty" data-testid="articles-empty">
          No articles available.
        </p>
      </div>
    );
  }

  const title = "Thoughts & Insights";

  return (
    <div className="articles-page" data-testid="articles-page">
      {/* Hero Blade: Title + Featured Articles (AC1) */}
      <section
        className="articles-blade articles-blade--hero"
        data-testid="articles-hero-blade"
      >
        <MotionTitle title={title} className="articles-title" />

        {featuredArticles.length > 0 && (
          <div
            className="articles-blade__featured"
            data-testid="articles-featured-container"
          >
            <FeaturedArticlesCarousel articles={featuredArticles} />
          </div>
        )}
      </section>

      {/* All Articles Blade: List format (Story 14.10) */}
      {/* Story 14.7: Sequential appearance for list articles */}
      {/* Story 14.8: Hover thumbnail integration */}
      {listArticles.length > 0 && (
        <section
          className="articles-blade articles-blade--list"
          data-testid="articles-list-blade"
        >
          <h2
            className="articles-list__heading"
            data-testid="articles-list-heading"
          >
            All Articles
          </h2>
          <div className="articles-list" data-testid="articles-list">
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

      {/* Story 14.8: Hover thumbnail popup - follows cursor */}
      <ArticleHoverThumbnail
        article={hoverState?.article ?? null}
        mousePosition={hoverState?.mousePosition ?? null}
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
