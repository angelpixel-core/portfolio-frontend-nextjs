/**
 * useArticleBySlug Hook Tests
 * Story 4.2: Article Content Reading
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useArticleBySlug from "../useArticleBySlug";
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

describe("useArticleBySlug hook", () => {
  it("should fetch and return article by slug", async () => {
    const testSlug = mockData[0].slug;
    const { result } = renderHook(() => useArticleBySlug(testSlug), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    jest.advanceTimersByTime(600);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.slug).toBe(testSlug);
    expect(result.current.data?.title).toBe(mockData[0].title);
  });

  it("should return null for non-existent slug", async () => {
    const { result } = renderHook(() => useArticleBySlug("non-existent-slug"), {
      wrapper: createWrapper(),
    });

    jest.advanceTimersByTime(600);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });

  it("should not fetch when enabled is false", async () => {
    const { result } = renderHook(
      () => useArticleBySlug(mockData[0].slug, { enabled: false }),
      {
        wrapper: createWrapper(),
      }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
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
