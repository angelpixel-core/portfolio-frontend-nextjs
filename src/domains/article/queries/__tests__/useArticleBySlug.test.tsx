/**
 * useArticleBySlug Hook Tests
 * Story 4.2: Article Content Reading
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useArticleBySlug from "../useArticleBySlug";
import articleModel from "../../model";
import {
  articlesFixture,
  getVisibleArticlesFixture,
} from "@/test-utils/fixtures/articles/articles.fixture";

jest.mock("../../model", () => ({
  __esModule: true,
  default: {
    fetchBySlug: jest.fn(),
  },
}));

const mockFetchBySlug = articleModel.fetchBySlug as jest.MockedFunction<
  typeof articleModel.fetchBySlug
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestQueryWrapper";
  return Wrapper;
};

describe("useArticleBySlug hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return article by slug", async () => {
    const visibleArticle = getVisibleArticlesFixture()[0];
    expect(visibleArticle).toBeDefined();
    const testSlug = visibleArticle?.slug ?? "";
    mockFetchBySlug.mockResolvedValue(visibleArticle);

    const { result } = renderHook(() => useArticleBySlug(testSlug), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.slug).toBe(testSlug);
    expect(result.current.data?.title).toBe(visibleArticle?.title);
  });

  it("should return null for non-existent slug", async () => {
    mockFetchBySlug.mockResolvedValue(null);

    const { result } = renderHook(() => useArticleBySlug("non-existent-slug"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });

  it("should not fetch when enabled is false", async () => {
    const { result } = renderHook(
      () => useArticleBySlug(articlesFixture[0].slug, { enabled: false }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(mockFetchBySlug).not.toHaveBeenCalled();
  });

  it("should be disabled when slug is empty", async () => {
    const { result } = renderHook(() => useArticleBySlug(""), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
