"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FeaturedArticleCard } from "@/organisms";
import { useReducedMotion } from "@/hooks";
import type { Article } from "@/domains/article/model/schema";
import "./styles.css";

const AUTO_ADVANCE_MS = 5000;
const RESUME_DELAY_MS = 8000;

interface FeaturedArticlesCarouselProps {
  articles: Article[];
  interval?: number;
}

export function FeaturedArticlesCarousel({
  articles,
  interval = AUTO_ADVANCE_MS,
}: FeaturedArticlesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = articles.length;
  const showControls = total > 1;

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const handleUserInteraction = useCallback(() => {
    setIsPaused(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, RESUME_DELAY_MS);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (!showControls || isPaused || shouldReduceMotion) return;
    const timer = setInterval(goNext, interval);
    return () => clearInterval(timer);
  }, [showControls, isPaused, shouldReduceMotion, goNext, interval]);

  // Cleanup resume timer on unmount
  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);

  const handleMouseLeave = useCallback(() => {
    if (!resumeTimerRef.current) setIsPaused(false);
  }, []);

  const handlePrevClick = useCallback(() => {
    goPrev();
    handleUserInteraction();
  }, [goPrev, handleUserInteraction]);

  const handleNextClick = useCallback(() => {
    goNext();
    handleUserInteraction();
  }, [goNext, handleUserInteraction]);

  const handleDotClick = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      handleUserInteraction();
    },
    [handleUserInteraction]
  );

  if (total === 0) return null;

  return (
    <div
      className="featured-carousel"
      onMouseEnter={showControls ? handleMouseEnter : undefined}
      onMouseLeave={showControls ? handleMouseLeave : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured articles"
      data-testid="featured-articles-carousel"
    >
      <div className="featured-carousel__viewport">
        <div
          className="featured-carousel__track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: shouldReduceMotion
              ? "none"
              : "transform 0.5s ease-in-out",
          }}
        >
          {articles.map((article, index) => (
            <div
              key={article.slug}
              className="featured-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${total}`}
              aria-hidden={index !== currentIndex}
              inert={index !== currentIndex ? true : undefined}
            >
              <FeaturedArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>

      {showControls && (
        <>
          <button
            className="featured-carousel__btn featured-carousel__btn--prev"
            onClick={handlePrevClick}
            aria-label="Previous featured article"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            className="featured-carousel__btn featured-carousel__btn--next"
            onClick={handleNextClick}
            aria-label="Next featured article"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div
            className="featured-carousel__dots"
            role="tablist"
            aria-label="Carousel navigation"
          >
            {articles.map((article, index) => (
              <button
                key={article.slug}
                className={`featured-carousel__dot ${index === currentIndex ? "featured-carousel__dot--active" : ""}`}
                onClick={() => handleDotClick(index)}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </>
      )}

      {showControls && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Showing featured article {currentIndex + 1} of {total}:{" "}
          {articles[currentIndex]?.title}
        </div>
      )}
    </div>
  );
}

export default FeaturedArticlesCarousel;
