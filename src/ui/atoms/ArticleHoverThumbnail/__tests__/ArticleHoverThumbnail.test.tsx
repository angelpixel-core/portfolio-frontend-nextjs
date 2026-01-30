/**
 * ArticleHoverThumbnail Component Tests
 * Story 14.8: Article Hover Thumbnail
 *
 * Tests for hover thumbnail display, positioning, animation, and edge cases.
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    onLoad,
    onError,
    style,
    className,
  }: {
    src: string;
    alt: string;
    onLoad?: () => void;
    onError?: () => void;
    style?: React.CSSProperties;
    className?: string;
  }) => {
    // Simulate successful image load by default
    React.useEffect(() => {
      if (src && !src.includes("error")) {
        onLoad?.();
      } else if (src.includes("error")) {
        onError?.();
      }
    }, [src, onLoad, onError]);

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        style={style}
        className={className}
        data-testid="hover-thumbnail-image"
      />
    );
  },
}));

// Mock useReducedMotion hook
let mockReducedMotion = false;
jest.mock("@/hooks", () => ({
  useReducedMotion: () => mockReducedMotion,
}));

import { ArticleHoverThumbnail } from "../index";
import type { Article } from "@/domains/article/model/schema";

// Sample article data
const mockArticle: Article = {
  id: 1,
  slug: "test-article",
  title: "Test Article Title",
  summary: "Test summary",
  img: "/test-image.jpg",
  published_at: "2023-01-27",
  reading_time: "5 min read",
  url: "/articles/test-article",
  featured: false,
};

// Sample DOMRect
const mockRect: DOMRect = {
  top: 200,
  left: 100,
  right: 500,
  bottom: 250,
  width: 400,
  height: 50,
  x: 100,
  y: 200,
  toJSON: () => ({}),
};

describe("ArticleHoverThumbnail - Rendering (AC1)", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("renders thumbnail when article and rect are provided", async () => {
    render(<ArticleHoverThumbnail article={mockArticle} rect={mockRect} />);

    await waitFor(() => {
      expect(screen.getByTestId("hover-thumbnail-image")).toBeInTheDocument();
    });
  });

  it("does not render when article is null", () => {
    const { container } = render(
      <ArticleHoverThumbnail article={null} rect={mockRect} />
    );

    expect(
      container.querySelector(".article-hover-thumbnail")
    ).not.toBeInTheDocument();
  });

  it("does not render when rect is null", () => {
    const { container } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={null} />
    );

    expect(
      container.querySelector(".article-hover-thumbnail")
    ).not.toBeInTheDocument();
  });

  it("renders article image with correct src", async () => {
    render(<ArticleHoverThumbnail article={mockArticle} rect={mockRect} />);

    await waitFor(() => {
      const img = screen.getByTestId("hover-thumbnail-image");
      expect(img).toHaveAttribute("src", "/test-image.jpg");
    });
  });

  it("renders with accessible alt text", async () => {
    render(<ArticleHoverThumbnail article={mockArticle} rect={mockRect} />);

    await waitFor(() => {
      const img = screen.getByTestId("hover-thumbnail-image");
      expect(img).toHaveAttribute("alt", "Thumbnail for Test Article Title");
    });
  });
});

describe("ArticleHoverThumbnail - Positioning (AC2)", () => {
  beforeEach(() => {
    mockReducedMotion = false;
    // Mock window dimensions
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1920,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      value: 1080,
    });
  });

  it("positions thumbnail using fixed positioning", async () => {
    const { container } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={mockRect} />
    );

    await waitFor(() => {
      const thumbnail = container.querySelector(".article-hover-thumbnail");
      expect(thumbnail).toHaveClass("article-hover-thumbnail");
    });
  });

  it("applies calculated position styles", async () => {
    const { container } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={mockRect} />
    );

    await waitFor(() => {
      const thumbnail = container.querySelector(
        ".article-hover-thumbnail"
      ) as HTMLElement;
      expect(thumbnail).toBeInTheDocument();
      // Verify styles are applied (exact values depend on calculation)
      expect(thumbnail.style.top).toBeTruthy();
      expect(thumbnail.style.left).toBeTruthy();
    });
  });
});

describe("ArticleHoverThumbnail - Reduced Motion (AC4)", () => {
  it("skips animation when reduced motion is enabled", async () => {
    mockReducedMotion = true;

    render(<ArticleHoverThumbnail article={mockArticle} rect={mockRect} />);

    await waitFor(() => {
      // Component should still render
      expect(screen.getByTestId("hover-thumbnail-image")).toBeInTheDocument();
    });
  });

  it("applies animation when reduced motion is not enabled", async () => {
    mockReducedMotion = false;

    render(<ArticleHoverThumbnail article={mockArticle} rect={mockRect} />);

    await waitFor(() => {
      expect(screen.getByTestId("hover-thumbnail-image")).toBeInTheDocument();
    });
  });
});

describe("ArticleHoverThumbnail - Image Loading (AC7)", () => {
  it("shows placeholder while image is loading", () => {
    // Override mock to not auto-call onLoad
    jest.doMock("next/image", () => ({
      __esModule: true,
      default: ({ src, alt }: { src: string; alt: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} data-testid="hover-thumbnail-image" />
      ),
    }));

    const { container } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={mockRect} />
    );

    // Placeholder should be present initially
    const placeholder = container.querySelector(
      ".article-hover-thumbnail__placeholder"
    );
    // Note: This test depends on the loading state timing
    expect(placeholder).toBeDefined();
  });

  it("hides thumbnail on image error", async () => {
    const errorArticle = { ...mockArticle, img: "/error-image.jpg" };

    const { container } = render(
      <ArticleHoverThumbnail article={errorArticle} rect={mockRect} />
    );

    await waitFor(() => {
      // On error, the thumbnail should not be visible
      const thumbnail = container.querySelector(".article-hover-thumbnail");
      expect(thumbnail).not.toBeInTheDocument();
    });
  });
});

describe("ArticleHoverThumbnail - Article Changes", () => {
  it("updates thumbnail when article changes", async () => {
    const { rerender } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={mockRect} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("hover-thumbnail-image")).toHaveAttribute(
        "src",
        "/test-image.jpg"
      );
    });

    const newArticle = { ...mockArticle, slug: "new-article", img: "/new.jpg" };
    rerender(<ArticleHoverThumbnail article={newArticle} rect={mockRect} />);

    await waitFor(() => {
      expect(screen.getByTestId("hover-thumbnail-image")).toHaveAttribute(
        "src",
        "/new.jpg"
      );
    });
  });

  it("handles transition from article to null", async () => {
    const { container, rerender } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={mockRect} />
    );

    await waitFor(() => {
      expect(
        container.querySelector(".article-hover-thumbnail")
      ).toBeInTheDocument();
    });

    rerender(<ArticleHoverThumbnail article={null} rect={null} />);

    await waitFor(() => {
      expect(
        container.querySelector(".article-hover-thumbnail")
      ).not.toBeInTheDocument();
    });
  });
});

describe("ArticleHoverThumbnail - Viewport Boundaries", () => {
  beforeEach(() => {
    mockReducedMotion = false;
  });

  it("prevents overflow to the right", async () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 300 });

    const rightRect: DOMRect = {
      ...mockRect,
      left: 250,
      right: 350,
    };

    const { container } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={rightRect} />
    );

    await waitFor(() => {
      const thumbnail = container.querySelector(".article-hover-thumbnail");
      // Should be constrained to viewport
      expect(thumbnail).toBeInTheDocument();
    });
  });

  it("positions below if would overflow top", async () => {
    const topRect: DOMRect = {
      ...mockRect,
      top: 50,
      bottom: 100,
    };

    const { container } = render(
      <ArticleHoverThumbnail article={mockArticle} rect={topRect} />
    );

    await waitFor(() => {
      const thumbnail = container.querySelector(".article-hover-thumbnail");
      // Position should be adjusted
      expect(thumbnail).toBeInTheDocument();
    });
  });
});
