"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { ArticleHoverThumbnailProps } from "./ArticleHoverThumbnail.types";
import "./styles.css";

/**
 * Thumbnail dimensions
 */
const THUMBNAIL_WIDTH = 220;
const THUMBNAIL_HEIGHT = 150;

/**
 * Offset from cursor position
 * Thumbnail appears above and to the right of the cursor
 */
const CURSOR_OFFSET_X = 15; // pixels to the right of cursor
const CURSOR_OFFSET_Y = 20; // pixels above cursor (negative direction)

/**
 * Minimum margin from viewport edges
 */
const VIEWPORT_MARGIN = 10;

/**
 * Animation variants for fade in/out
 */
const variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
};

/**
 * Animation transitions
 */
const transitions = {
  enter: { duration: 0.25, ease: "easeOut" },
  exit: { duration: 0.15, ease: "easeIn" },
};

/**
 * Calculate thumbnail position based on mouse cursor
 * Positions thumbnail above and to the right of cursor, with viewport boundary checks
 */
function calculatePosition(
  mouseX: number,
  mouseY: number
): {
  top: number;
  left: number;
} {
  // Viewport dimensions
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1920;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 1080;

  // Start position: above and to the right of cursor
  let left = mouseX + CURSOR_OFFSET_X;
  let top = mouseY - THUMBNAIL_HEIGHT - CURSOR_OFFSET_Y;

  // Prevent overflow right - flip to left side of cursor if needed
  if (left + THUMBNAIL_WIDTH > viewportWidth - VIEWPORT_MARGIN) {
    left = mouseX - THUMBNAIL_WIDTH - CURSOR_OFFSET_X;
  }

  // Prevent overflow left
  if (left < VIEWPORT_MARGIN) {
    left = VIEWPORT_MARGIN;
  }

  // If would overflow top, position below cursor instead
  if (top < VIEWPORT_MARGIN) {
    top = mouseY + CURSOR_OFFSET_Y;
  }

  // Prevent overflow bottom
  if (top + THUMBNAIL_HEIGHT > viewportHeight - VIEWPORT_MARGIN) {
    top = viewportHeight - THUMBNAIL_HEIGHT - VIEWPORT_MARGIN;
  }

  return { top, left };
}

/**
 * ArticleHoverThumbnail - Floating thumbnail that follows cursor on article hover
 *
 * Features:
 * - Fixed positioning that follows mouse cursor
 * - Appears above and to the right of cursor
 * - Fade in/out animation with Framer Motion
 * - Reduced motion support
 * - Touch device detection (hidden via CSS)
 * - Viewport boundary detection
 *
 * Story 14.8: Article Hover Thumbnail
 *
 * @example
 * ```tsx
 * <ArticleHoverThumbnail
 *   article={hoveredArticle}
 *   mousePosition={{ x: mouseX, y: mouseY }}
 * />
 * ```
 */
export function ArticleHoverThumbnail({
  article,
  mousePosition,
}: ArticleHoverThumbnailProps) {
  const shouldReduceMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prevSlugRef = useRef<string | undefined>(undefined);

  // Calculate position when mouse moves
  const position = useMemo(() => {
    if (!mousePosition) return null;
    return calculatePosition(mousePosition.x, mousePosition.y);
  }, [mousePosition]);

  // Reset image state when article changes (not on initial mount)
  useEffect(() => {
    const currentSlug = article?.slug;
    if (
      prevSlugRef.current !== undefined &&
      prevSlugRef.current !== currentSlug
    ) {
      setImageLoaded(false);
      setImageError(false);
    }
    prevSlugRef.current = currentSlug;
  }, [article?.slug]);

  // Don't render if no article, mousePosition, or image error
  const shouldRender = article && mousePosition && position && !imageError;

  // Animation props based on reduced motion preference
  const animationProps = useMemo(
    () =>
      shouldReduceMotion
        ? {
            initial: false as const,
            animate: "visible",
            exit: "visible",
          }
        : {
            initial: "hidden",
            animate: "visible",
            exit: "hidden",
            variants,
            transition: transitions.enter,
          },
    [shouldReduceMotion]
  );

  return (
    <AnimatePresence mode="wait">
      {shouldRender && (
        <m.div
          key={article.slug}
          className="article-hover-thumbnail"
          style={{
            top: position.top,
            left: position.left,
          }}
          data-testid="article-hover-thumbnail"
          {...animationProps}
        >
          {!imageLoaded && (
            <div
              className="article-hover-thumbnail__placeholder"
              data-testid="article-hover-thumbnail-placeholder"
            />
          )}
          <Image
            src={article.img}
            alt={article.img_alt ?? `Thumbnail for ${article.title}`}
            width={THUMBNAIL_WIDTH}
            height={THUMBNAIL_HEIGHT}
            className="article-hover-thumbnail__image"
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority
            unoptimized={article.img.startsWith("http")}
            data-testid="article-hover-thumbnail-image"
          />
        </m.div>
      )}
    </AnimatePresence>
  );
}

export default ArticleHoverThumbnail;
export type { ArticleHoverThumbnailProps };
