/**
 * ArticleContent Component Tests
 * Story 4.2: Article Content Reading
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import ArticleContent from "../index";
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

// Mock SocialShareButtons component (default export)
jest.mock("@/molecules/SocialShareButtons", () => ({
  __esModule: true,
  default: ({ url, title }: { url: string; title: string }) => (
    <div data-testid="social-share-buttons" data-url={url} data-title={title}>
      <button aria-label="Share on Twitter">Twitter</button>
      <button aria-label="Share on LinkedIn">LinkedIn</button>
    </div>
  ),
}));

const originalLocation = window.location;

beforeAll(() => {
  // Mock window.location for URL building
  const win = window as unknown as { location?: Location };
  delete win.location;
  win.location = { origin: "https://example.com" } as Location;
});

afterAll(() => {
  const win = window as unknown as { location?: Location };
  win.location = originalLocation;
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
  category: "React",
  badges: ["Hooks", "Patterns", "Testing"],
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

    it("renders back to articles links (top and bottom)", () => {
      render(<ArticleContent article={mockArticle} />);

      const links = screen.getAllByRole("link", { name: /Back to Articles/ });
      expect(links).toHaveLength(2);
      links.forEach((link) => {
        expect(link).toHaveAttribute("href", "/articles");
      });
    });

    it("does not render table of contents block", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.queryByText("On this article")).not.toBeInTheDocument();
    });

    it("renders article tags metadata", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Hooks")).toBeInTheDocument();
      expect(screen.getByText("Patterns")).toBeInTheDocument();
      expect(screen.getByText("Testing")).toBeInTheDocument();
    });
  });

  describe("renders content correctly", () => {
    it("renders headings from markdown", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(
        screen.getByRole("heading", { name: "Second Heading" })
      ).toBeInTheDocument();
    });

    it("renders paragraph content", () => {
      render(<ArticleContent article={mockArticle} />);

      expect(screen.getByText("This is a paragraph.")).toBeInTheDocument();
    });

    it("styles first paragraph as lead copy", () => {
      const { container } = render(<ArticleContent article={mockArticle} />);

      const leadParagraph = container.querySelector(
        ".article-content__paragraph--lead"
      );
      expect(leadParagraph).toBeInTheDocument();
      expect(leadParagraph).toHaveTextContent("This is a paragraph.");
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

    it("renders markdown links as anchor elements", () => {
      const articleWithLink: Article = {
        ...mockArticle,
        content: "Visit [Portfolio](https://example.com/portfolio)",
      };

      render(<ArticleContent article={articleWithLink} />);

      const link = screen.getByRole("link", { name: "Portfolio" });
      expect(link).toHaveAttribute("href", "https://example.com/portfolio");
    });

    it("renders markdown links with parenthesis in URL without truncation", () => {
      const articleWithComplexUrl: Article = {
        ...mockArticle,
        content: "Read [Spec](https://example.com/files/report(v2).pdf)",
      };

      render(<ArticleContent article={articleWithComplexUrl} />);

      const link = screen.getByRole("link", { name: "Spec" });
      expect(link).toHaveAttribute(
        "href",
        "https://example.com/files/report(v2).pdf"
      );
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

      const paragraph = container.querySelector(".article-content__paragraph");
      expect(paragraph?.innerHTML ?? "").not.toContain("<script>");
      expect(paragraph?.textContent ?? "").not.toContain("alert");
    });

    it("escapes HTML in inline code content", () => {
      const xssArticle: Article = {
        ...mockArticle,
        content: "Use `<script>bad</script>` carefully",
      };

      const { container } = render(<ArticleContent article={xssArticle} />);

      // Should NOT contain actual script tag
      expect(container.querySelector("script")).not.toBeInTheDocument();

      const inlineCode = container.querySelector(
        ".article-content__inline-code"
      );
      expect(inlineCode).toBeInTheDocument();
      expect(inlineCode?.innerHTML ?? "").not.toContain("<script>");
    });

    it("neutralizes javascript protocol links", () => {
      const articleWithBadLink: Article = {
        ...mockArticle,
        content: '<a href="javascript:alert(1)">Bad Link</a>',
      };

      const { container } = render(
        <ArticleContent article={articleWithBadLink} />
      );

      expect(
        screen.queryByRole("link", { name: "Bad Link" })
      ).not.toBeInTheDocument();
      const paragraph = container.querySelector(".article-content__paragraph");
      expect(paragraph?.textContent).toContain("Bad Link");
      expect(paragraph?.innerHTML ?? "").not.toMatch(/javascript:/i);
    });

    it("removes event-handler payload attributes from rendered content", () => {
      const articleWithEventPayload: Article = {
        ...mockArticle,
        content: '<img src="x" onerror="alert(1)" />Event payload',
      };

      const { container } = render(
        <ArticleContent article={articleWithEventPayload} />
      );

      const body = container.querySelector(".article-content__body");
      expect(body?.querySelector("img")).not.toBeInTheDocument();
      expect(body?.innerHTML ?? "").not.toMatch(/onerror\s*=/i);
      expect(body?.innerHTML ?? "").not.toMatch(/onload\s*=/i);
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
        `${window.location.origin}/articles/test-article`
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
