import React, { type ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createFetchAllHook,
  createFetchByIdHook,
} from "../createQueryHook";
import { DEFAULT_STALE_TIME, DEFAULT_GC_TIME } from "../queryConfig";

// Create a wrapper with QueryClient for each test
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }
  return { Wrapper, queryClient };
}

describe("createFetchAllHook", () => {
  it("creates a hook that fetches all data", async () => {
    const mockData = [{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }];
    const mockFetchFn = jest.fn().mockResolvedValue(mockData);

    const useItems = createFetchAllHook<typeof mockData>({
      queryKey: "items",
      fetchFn: mockFetchFn,
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useItems(), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockFetchFn).toHaveBeenCalledTimes(1);
  });

  it("uses default cache times from queryConfig", async () => {
    const mockFetchFn = jest.fn().mockResolvedValue([]);

    const useItems = createFetchAllHook<unknown[]>({
      queryKey: "test-defaults",
      fetchFn: mockFetchFn,
    });

    const { Wrapper, queryClient } = createWrapper();
    renderHook(() => useItems(), { wrapper: Wrapper });

    await waitFor(() => {
      const queryState = queryClient.getQueryCache().find({ queryKey: ["test-defaults"] });
      expect(queryState).toBeDefined();
    });

    // Verify the defaults are exported correctly
    expect(DEFAULT_STALE_TIME).toBe(1000 * 60 * 5); // 5 minutes
    expect(DEFAULT_GC_TIME).toBe(1000 * 60 * 10); // 10 minutes
  });

  it("allows custom staleTime and gcTime overrides", async () => {
    const mockFetchFn = jest.fn().mockResolvedValue([]);
    const customStaleTime = 1000;
    const customGcTime = 2000;

    const useItems = createFetchAllHook<unknown[]>({
      queryKey: "custom-times",
      fetchFn: mockFetchFn,
      staleTime: customStaleTime,
      gcTime: customGcTime,
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useItems(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Hook should work with custom times
    expect(result.current.data).toEqual([]);
  });
});

describe("createFetchByIdHook", () => {
  it("creates a hook that fetches data by id", async () => {
    const mockItem = { id: 1, name: "Item 1" };
    const mockFetchFn = jest.fn().mockResolvedValue(mockItem);

    const useItem = createFetchByIdHook<typeof mockItem, number>({
      queryKey: "item",
      fetchFn: mockFetchFn,
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useItem(1), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockItem);
    expect(mockFetchFn).toHaveBeenCalledWith(1);
  });

  it("is disabled when param is undefined", () => {
    const mockFetchFn = jest.fn().mockResolvedValue(null);

    const useItem = createFetchByIdHook<{ id: number }, number>({
      queryKey: "item",
      fetchFn: mockFetchFn,
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useItem(undefined), { wrapper: Wrapper });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockFetchFn).not.toHaveBeenCalled();
  });

  it("enabled override can only disable, not enable without param", () => {
    const mockFetchFn = jest.fn().mockResolvedValue({ id: 1 });

    const useItem = createFetchByIdHook<{ id: number }, number>({
      queryKey: "item-safety",
      fetchFn: mockFetchFn,
    });

    const { Wrapper } = createWrapper();

    // Even with enabled: true, undefined param should not trigger fetch
    // This is the safety guard test
    const { result } = renderHook(
      () => useItem(undefined, { enabled: true }),
      { wrapper: Wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockFetchFn).not.toHaveBeenCalled();
  });

  it("enabled: false disables fetch even with valid param", () => {
    const mockFetchFn = jest.fn().mockResolvedValue({ id: 1 });

    const useItem = createFetchByIdHook<{ id: number }, number>({
      queryKey: "item-disabled",
      fetchFn: mockFetchFn,
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(
      () => useItem(1, { enabled: false }),
      { wrapper: Wrapper }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
    expect(mockFetchFn).not.toHaveBeenCalled();
  });

  it("includes param in query key for proper caching", async () => {
    const mockFetchFn = jest.fn().mockResolvedValue({ id: 1 });

    const useItem = createFetchByIdHook<{ id: number }, number>({
      queryKey: "cached-item",
      fetchFn: mockFetchFn,
    });

    const { Wrapper, queryClient } = createWrapper();
    renderHook(() => useItem(42), { wrapper: Wrapper });

    await waitFor(() => {
      const queryState = queryClient.getQueryCache().find({ queryKey: ["cached-item", 42] });
      expect(queryState).toBeDefined();
    });
  });

  it("works with string params (e.g., slugs)", async () => {
    const mockItem = { slug: "test-slug", title: "Test" };
    const mockFetchFn = jest.fn().mockResolvedValue(mockItem);

    const useItemBySlug = createFetchByIdHook<typeof mockItem, string>({
      queryKey: "item-by-slug",
      fetchFn: mockFetchFn,
    });

    const { Wrapper } = createWrapper();
    const { result } = renderHook(
      () => useItemBySlug("test-slug"),
      { wrapper: Wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockItem);
    expect(mockFetchFn).toHaveBeenCalledWith("test-slug");
  });
});
