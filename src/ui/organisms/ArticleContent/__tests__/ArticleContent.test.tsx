/**
 * ArticleContent Component Tests
 * Story 4.2: Article Content Reading
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { ArticleContent } from "../index";
import type { Article } from "@/domains/article";

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useReducedMotion hook
jest.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));

// Mock CodeBlock component
jest.mock("../CodeBlock", () => ({
  CodeBlock: ({ code, language }: { code: string; language: string }) => (
    <pre data-testid="code-block" data-language={language}>
      <code>{code}</code>
    </pre>
  ),
}));

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Mock next/image
jest.mock("next/image", () => {
  return function MockImage({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} />;
  };
});

// Mock SocialShareButtons component
jest.mock("@/molecules/SocialShareButtons", () => ({
  SocialShareButtons: ({ url, title }: { url: string; title: string }) => (
    <div data-testid="social-share-buttons" data-url={url} data-title={title}>
      <button aria-label="Share on Twitter">Twitter</button>
      <button aria-label="Share on LinkedIn">LinkedIn</button>
    </div>
  ),
}));

// Mock window.location for URL building
Object.defineProperty(window, "location", {
  writable: true,
  value: { origin: "https://example.com" },
});

const mockArticle: Article = {
  id: 1,
  title: "Test Article Title",
  url: "/articles/test-article",
  slug: "test-article",
  reading_time: "5 min read",
  published_at: "2023-03-22",
  summary: "This is a test article summary.",
  content: `# Test Heading

This is a paragraph.

## Second Heading

- List item one
- List item two

\`\`\`tsx
const example = "code block";
\`\`\`
`,
  img: "/images/test.jpg",
  featured: true,
  status: "published",
};

describe("ArticleContent", () => {
  describe("renders article information", () => {
    it("renders article title", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(
        screen.getByRole("heading", { name: "Test Article Title" })
      ).toBeInTheDocument();
    });

    it("renders reading time", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText("5 min read")).toBeInTheDocument();
    });

    it("renders published date", () => {
      render(<ArticleContent article={mockArticle} />);

      // Date is formatted based on locale - may show March 21 or 22 depending on timezone
      expect(screen.getByText(/March \d+, 2023/)).toBeInTheDocument();
    });

    it("renders featured image", () => {
      render(<ArticleContent article={mockArticle} />);

      const image = screen.getByRole("img", {
        name: /Featured image for Test Article Title/,
      });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/images/test.jpg");
    });

    it("renders back to articles link", () => {
      render(<ArticleContent article={mockArticle} />);

      const link = screen.getByRole("link", { name: /Back to Articles/ });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/articles");
    });
  });

  describe("renders content correctly", () => {
    it("renders headings from markdown", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(
        screen.getByRole("heading", { name: "Test Heading" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: "Second Heading" })
      ).toBeInTheDocument();
    });

    it("renders paragraph content", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
    });

    it("renders list items", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText("List item one")).toBeInTheDocument();
      expect(screen.getByText("List item two")).toBeInTheDocument();
    });

    it("wraps list items in proper ul element", () => {
      const { container } = render(<ArticleContent article={mockArticle} />);

      const ul = container.querySelector("ul.article-content__list");
      expect(ul).toBeInTheDocument();

      const listItems = ul?.querySelectorAll("li.article-content__list-item");
      expect(listItems?.length).toBe(2);
    });
  });

  describe("security", () => {
    it("escapes HTML in paragraph content to prevent XSS", () => {
      const xssArticle: Article = {
        ...mockArticle,
        content: '<script>alert("xss")</script>',
      };

      const { container } = render(<ArticleContent article={xssArticle} />);

      // Should NOT contain actual script tag
      expect(container.querySelector("script")).not.toBeInTheDocument();

      // Should contain escaped HTML entities
      const paragraph = container.querySelector(".article-content__paragraph");
      expect(paragraph?.innerHTML).toContain("&lt;script&gt;");
      expect(paragraph?.innerHTML).toContain("&lt;/script&gt;");
    });

    it("escapes HTML in inline code content", () => {
      const xssArticle: Article = {
        ...mockArticle,
        content: "Use `<script>bad</script>` carefully",
      };

      const { container } = render(<ArticleContent article={xssArticle} />);

      // Should NOT contain actual script tag
      expect(container.querySelector("script")).not.toBeInTheDocument();

      // Inline code should have escaped content
      const inlineCode = container.querySelector(
        ".article-content__inline-code"
      );
      expect(inlineCode?.innerHTML).toContain("&lt;script&gt;");
    });
  });

  describe("accessibility", () => {
    it("has article landmark with labelledby", () => {
      render(<ArticleContent article={mockArticle} />);

      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("aria-labelledby", "article-title");
    });

    it("has proper heading hierarchy", () => {
      render(<ArticleContent article={mockArticle} />);

      const headings = screen.getAllByRole("heading");
      // Should have at least the main title
      expect(headings.length).toBeGreaterThan(0);
    });

    it("has time element with datetime attribute", () => {
      render(<ArticleContent article={mockArticle} />);

      // Date is formatted based on locale - may show March 21 or 22 depending on timezone
      const time = screen.getByText(/March \d+, 2023/);
      expect(time).toHaveAttribute("datetime", "2023-03-22");
    });

    it("reading time has aria-label", () => {
      render(<ArticleContent article={mockArticle} />);

      const readingTime = screen.getByLabelText("Reading time");
      expect(readingTime).toBeInTheDocument();
    });
  });

  describe("fallback behavior", () => {
    it("renders summary when content is undefined", () => {
      const articleWithoutContent: Article = {
        ...mockArticle,
        content: undefined,
      };

      render(<ArticleContent article={articleWithoutContent} />);

      expect(
        screen.getByText("This is a test article summary.")
      ).toBeInTheDocument();
    });
  });

  describe("social sharing integration", () => {
    it("renders social share buttons after client-side URL is available", async () => {
      render(<ArticleContent article={mockArticle} />);

      // Wait for useEffect to run and set articleUrl
      const shareButtons = await screen.findByTestId("social-share-buttons");
      expect(shareButtons).toBeInTheDocument();
    });

    it("passes correct URL to social share buttons", async () => {
      render(<ArticleContent article={mockArticle} />);

      const shareButtons = await screen.findByTestId("social-share-buttons");
      expect(shareButtons).toHaveAttribute(
        "data-url",
        "https://example.com/articles/test-article"
      );
    });

    it("passes article title to social share buttons", async () => {
      render(<ArticleContent article={mockArticle} />);

      const shareButtons = await screen.findByTestId("social-share-buttons");
      expect(shareButtons).toHaveAttribute("data-title", "Test Article Title");
    });

    it("renders Twitter and LinkedIn share buttons", async () => {
      render(<ArticleContent article={mockArticle} />);

      expect(
        await screen.findByRole("button", { name: /share on twitter/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /share on linkedin/i })
      ).toBeInTheDocument();
    });
  });
});
