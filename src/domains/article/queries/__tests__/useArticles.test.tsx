import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useArticles from "../useArticles";
import mockData from "../../model/mock";

jest.useFakeTimers();

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
  it("should fetch and return articles from mock data", async () => {
    const visibleArticles = mockData.filter((article) => article.visible);
    const { result } = renderHook(() => useArticles(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    jest.advanceTimersByTime(2000);

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
