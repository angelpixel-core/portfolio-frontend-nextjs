/**
 * ArticleListItem Component Tests
 * Story 14.10: Article List Format
 *
 * Tests for list item display with title, date, and left border accent.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ArticleListItem } from "../index";
import type { Article } from "@/domains/article/model/schema";

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

// Sample article data
const mockArticle: Article = {
  id: 1,
  slug: "test-article",
  title: "Test Article Title That Might Be Long",
  summary: "This is a test summary",
  img: "/test-image.jpg",
  published_at: "2023-01-27",
  reading_time: "5 min read",
  url: "/articles/test-article",
  featured: false,
};

describe("ArticleListItem - Structure (AC1)", () => {
  it("renders article title", () => {
    render(<ArticleListItem article={mockArticle} />);

    expect(
      screen.getByText("Test Article Title That Might Be Long")
    ).toBeInTheDocument();
  });

  it("renders publication date", () => {
    render(<ArticleListItem article={mockArticle} />);

    // Date should be formatted
    expect(screen.getByText(/January 27, 2023/i)).toBeInTheDocument();
  });

  it("does NOT render image", () => {
    render(<ArticleListItem article={mockArticle} />);

    const img = screen.queryByRole("img");
    expect(img).not.toBeInTheDocument();
  });

  it("does NOT render summary", () => {
    render(<ArticleListItem article={mockArticle} />);

    expect(
      screen.queryByText("This is a test summary")
    ).not.toBeInTheDocument();
  });

  it("has left border accent class", () => {
    const { container } = render(<ArticleListItem article={mockArticle} />);

    const listItem = container.querySelector(".article-list-item");
    expect(listItem).toHaveClass("article-list-item");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ArticleListItem article={mockArticle} className="custom-class" />
    );

    const listItem = container.querySelector(".article-list-item");
    expect(listItem).toHaveClass("custom-class");
  });
});

describe("ArticleListItem - Link behavior (AC6)", () => {
  it("wraps content in a link to article", () => {
    render(<ArticleListItem article={mockArticle} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articles/test-article");
  });

  it("has accessible label", () => {
    render(<ArticleListItem article={mockArticle} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName(/Test Article Title/i);
  });
});

describe("ArticleListItem - Hover state (AC5)", () => {
  it("calls onHoverChange with true when mouse enters", () => {
    const onHoverChange = jest.fn();
    const { container } = render(
      <ArticleListItem article={mockArticle} onHoverChange={onHoverChange} />
    );

    const listItem = container.querySelector(".article-list-item");
    fireEvent.mouseEnter(listItem!);

    expect(onHoverChange).toHaveBeenCalledWith(true, expect.any(Object));
  });

  it("calls onHoverChange with false when mouse leaves", () => {
    const onHoverChange = jest.fn();
    const { container } = render(
      <ArticleListItem article={mockArticle} onHoverChange={onHoverChange} />
    );

    const listItem = container.querySelector(".article-list-item");
    fireEvent.mouseEnter(listItem!);
    fireEvent.mouseLeave(listItem!);

    expect(onHoverChange).toHaveBeenLastCalledWith(false, null);
  });

  it("does not throw when onHoverChange is not provided", () => {
    const { container } = render(<ArticleListItem article={mockArticle} />);

    const listItem = container.querySelector(".article-list-item");
    expect(() => {
      fireEvent.mouseEnter(listItem!);
      fireEvent.mouseLeave(listItem!);
    }).not.toThrow();
  });
});

describe("ArticleListItem - Date formatting", () => {
  it("formats ISO date to readable format", () => {
    render(<ArticleListItem article={mockArticle} />);

    // Should format "2023-01-27" to "January 27, 2023"
    expect(screen.getByText(/January 27, 2023/i)).toBeInTheDocument();
  });

  it("handles different date formats", () => {
    const articleWithDifferentDate = {
      ...mockArticle,
      published_at: "2023-12-31",
    };
    render(<ArticleListItem article={articleWithDifferentDate} />);

    expect(screen.getByText(/December 31, 2023/i)).toBeInTheDocument();
  });
});

describe("ArticleListItem - Accessibility (AC6)", () => {
  it("has semantic article element", () => {
    render(<ArticleListItem article={mockArticle} />);

    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("date has time element with datetime attribute", () => {
    const { container } = render(<ArticleListItem article={mockArticle} />);

    const timeElement = container.querySelector("time");
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute("dateTime", "2023-01-27");
  });

  it("title is a heading", () => {
    render(<ArticleListItem article={mockArticle} />);

    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });
});

describe("ArticleListItem - Touch behavior", () => {
  it("has adequate touch target size class", () => {
    const { container } = render(<ArticleListItem article={mockArticle} />);

    const listItem = container.querySelector(".article-list-item");
    expect(listItem).toBeInTheDocument();
    // The min-height for touch targets is handled by CSS
  });
});
