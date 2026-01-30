"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import type { ArticleHoverThumbnailProps } from "./ArticleHoverThumbnail.types";
import "./styles.css";

/**
 * Thumbnail dimensions
 */
const THUMBNAIL_WIDTH = 220;
const THUMBNAIL_HEIGHT = 150;

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
 * Calculate thumbnail position based on element rect
 * Centers horizontally over the element, positioned above with slight overlap
 */
function calculatePosition(rect: DOMRect): { top: number; left: number } {
  // Center horizontally over the article row
  let left = rect.left + rect.width / 2 - THUMBNAIL_WIDTH / 2;

  // Position above the row with slight overlap
  let top = rect.top - THUMBNAIL_HEIGHT + 30;

  // Viewport boundary checks
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1920;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 1080;

  // Prevent overflow right
  if (left + THUMBNAIL_WIDTH > viewportWidth - 10) {
    left = viewportWidth - THUMBNAIL_WIDTH - 10;
  }

  // Prevent overflow left
  if (left < 10) {
    left = 10;
  }

  // If would overflow top, position below instead
  if (top < 10) {
    top = rect.bottom + 10;
  }

  // Prevent overflow bottom
  if (top + THUMBNAIL_HEIGHT > viewportHeight - 10) {
    top = viewportHeight - THUMBNAIL_HEIGHT - 10;
  }

  return { top, left };
}

/**
 * ArticleHoverThumbnail - Floating thumbnail that appears on article hover
 *
 * Features:
 * - Fixed positioning based on hovered element's rect
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
 *   rect={hoveredRect}
 * />
 * ```
 */
export function ArticleHoverThumbnail({
  article,
  rect,
}: ArticleHoverThumbnailProps) {
  const shouldReduceMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate position when rect changes
  const position = useMemo(() => {
    if (!rect) return null;
    return calculatePosition(rect);
  }, [rect]);

  // Note: State is reset naturally when article changes because we use
  // key={article.slug} on the motion.div, which unmounts/remounts the component

  // Don't render if no article, rect, or image error
  const shouldRender = article && rect && position && !imageError;

  // Animation props based on reduced motion preference
  const animationProps = shouldReduceMotion
    ? {
        initial: false,
        animate: "visible",
        exit: "visible",
      }
    : {
        initial: "hidden",
        animate: "visible",
        exit: "hidden",
        variants,
        transition: transitions.enter,
      };

  return (
    <AnimatePresence mode="wait">
      {shouldRender && (
        <motion.div
          key={article.slug}
          className="article-hover-thumbnail"
          style={{
            top: position.top,
            left: position.left,
          }}
          {...animationProps}
        >
          {!imageLoaded && (
            <div className="article-hover-thumbnail__placeholder" />
          )}
          <Image
            src={article.img}
            alt={`Thumbnail for ${article.title}`}
            width={THUMBNAIL_WIDTH}
            height={THUMBNAIL_HEIGHT}
            className="article-hover-thumbnail__image"
            style={{ display: imageLoaded ? "block" : "none" }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            priority={false}
            unoptimized={article.img.startsWith("http")}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ArticleHoverThumbnail;
export type { ArticleHoverThumbnailProps };
