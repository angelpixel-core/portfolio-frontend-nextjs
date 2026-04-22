import { render, screen } from "@testing-library/react";

import articleModel from "@/domains/article/model";
import accessModel from "@/domains/access/model";
import { auth } from "@/lib/auth";

jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    cache: (fn: unknown) => fn,
  };
});

jest.mock("@/domains/article/model", () => ({
  __esModule: true,
  default: {
    fetchBySlug: jest.fn(),
  },
}));

jest.mock("@/domains/access/model", () => ({
  __esModule: true,
  default: {
    hasAccess: jest.fn(),
  },
}));

jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(async () => new Headers()),
}));

jest.mock("@/organisms/ArticleContent", () => ({
  __esModule: true,
  default: ({ article }: { article: { title: string } }) => (
    <div data-testid="article-content">{article.title}</div>
  ),
}));

jest.mock("@/molecules/Monetization", () => ({
  StealPatternCTA: () => (
    <div data-testid="article-monetization">Paywall CTA</div>
  ),
}));

const mockFetchBySlug = articleModel.fetchBySlug as jest.MockedFunction<
  typeof articleModel.fetchBySlug
>;

const mockHasAccess = accessModel.hasAccess as jest.MockedFunction<
  typeof accessModel.hasAccess
>;

const mockGetSession = auth.api.getSession as jest.MockedFunction<
  typeof auth.api.getSession
>;

let ArticleDetailPage: typeof import("../page").default;

const baseArticle = {
  id: 1,
  title: "Why Portfolio Does Not Convert",
  url: "/articles/why-portfolio-not-convert",
  slug: "why-portfolio-not-convert",
  lang: "EN" as const,
  reading_time: "5 min",
  published_at: "2026-04-01",
  summary: "Article summary",
  img: "/images/mock.png",
  featured: false,
  status: "published" as const,
};

describe("ArticleDetailPage access control", () => {
  beforeAll(async () => {
    ({ default: ArticleDetailPage } = await import("../page"));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchBySlug.mockResolvedValue(baseArticle);
    mockGetSession.mockResolvedValue(null);
    mockHasAccess.mockResolvedValue(false);
  });

  it("shows locked state for monetized article without access", async () => {
    const ui = await ArticleDetailPage({
      params: Promise.resolve({ slug: "why-portfolio-not-convert" }),
    });
    render(ui);

    expect(screen.getByText(/this content is locked/i)).toBeInTheDocument();
    expect(screen.getByTestId("article-monetization")).toBeInTheDocument();
    expect(screen.queryByTestId("article-content")).not.toBeInTheDocument();
  });

  it("shows full article content for monetized article with access", async () => {
    mockGetSession.mockResolvedValue({
      user: { id: "user-1", email: "buyer@test.com" },
    } as any);
    mockHasAccess.mockResolvedValue(true);

    const ui = await ArticleDetailPage({
      params: Promise.resolve({ slug: "why-portfolio-not-convert" }),
    });
    render(ui);

    expect(screen.getByTestId("article-content")).toBeInTheDocument();
    expect(
      screen.queryByText(/this content is locked/i)
    ).not.toBeInTheDocument();
  });

  it("shows non-monetized article without checking access", async () => {
    mockFetchBySlug.mockResolvedValue({
      ...baseArticle,
      slug: "non-monetized-article",
      title: "Public Article",
    });

    const ui = await ArticleDetailPage({
      params: Promise.resolve({ slug: "non-monetized-article" }),
    });
    render(ui);

    expect(screen.getByTestId("article-content")).toBeInTheDocument();
    expect(mockHasAccess).not.toHaveBeenCalled();
  });
});
