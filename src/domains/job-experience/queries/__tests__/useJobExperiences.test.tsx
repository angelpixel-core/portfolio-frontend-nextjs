import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useJobExperiences from "../useJobExperiences";
import mockData from "../../model/mock";
import type { JobExperiences } from "../../model/schema";

// Wrapper with QueryClient for testing React Query hooks
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

describe("useJobExperiences hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("should fetch and return job experiences from mock data", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useJobExperiences(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(mockData.length);
    expect((result.current.data as JobExperiences)?.[0].company).toBe(
      mockData[0].company
    );
  });

  it("should return job experiences in correct order", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useJobExperiences(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(mockData.length);
    // Verify order matches the mock source
    expect(result.current.data?.[0].company).toBe(mockData[0].company);
    expect(result.current.data?.[mockData.length - 1].company).toBe(
      mockData[mockData.length - 1].company
    );
  });

  it("should handle error state when fetchAll fails", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Network error" }),
    });

    const { result } = renderHook(() => useJobExperiences(), {
      wrapper: createWrapper(),
    });

    // Wait for React Query to handle the error
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      "Failed to fetch job experiences"
    );
    expect(result.current.data).toBeUndefined();
  });

  it("should have work tasks for each experience", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useJobExperiences(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify each experience has work array
    result.current.data?.forEach((experience) => {
      expect(experience.work).toBeDefined();
      expect(Array.isArray(experience.work)).toBe(true);
      expect(experience.work!.length).toBeGreaterThan(0);
    });
  });
});
