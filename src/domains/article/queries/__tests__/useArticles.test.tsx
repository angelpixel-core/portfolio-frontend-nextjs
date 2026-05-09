import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useArticles from "../useArticles";
import articleModel from "../../model";
import { getVisibleArticlesFixture } from "@/test-utils/fixtures/articles/articles.fixture";

jest.mock("../../model", () => ({
  __esModule: true,
  default: {
    fetchAll: jest.fn(),
  },
}));

const mockFetchAll = articleModel.fetchAll as jest.MockedFunction<
  typeof articleModel.fetchAll
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

describe("useArticles hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return articles from mock data", async () => {
    const visibleArticles = getVisibleArticlesFixture();
    mockFetchAll.mockResolvedValue(visibleArticles);

    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(visibleArticles.length);
    // Note: The model may sort articles by date, so we check all titles are present
    const returnedTitles = (
      result.current.data as Array<{ title: string }>
    )?.map((a) => a.title);
    visibleArticles.forEach((article) => {
      expect(returnedTitles).toContain(article.title);
    });
  });
});
