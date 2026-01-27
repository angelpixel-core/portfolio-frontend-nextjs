import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useProject from "../useProject";
import mockData from "../../model/mock";
import type { ProjectModel } from "../../model/schema";

// Mock the model module
jest.mock("../../model", () => ({
  __esModule: true,
  default: {
    fetchBySlug: jest.fn(),
  },
}));

import model from "../../model";

// Wrapper con QueryClient para testear hooks de React Query
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

const mockedModel = model as jest.Mocked<typeof model>;

describe("useProject hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return a single project by slug", async () => {
    const testProject = mockData[0];
    mockedModel.fetchBySlug.mockResolvedValue(testProject);

    const { result } = renderHook(() => useProject("crypto-screener"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect((result.current.data as ProjectModel)?.title).toBe(
      testProject.title
    );
    expect((result.current.data as ProjectModel)?.slug).toBe(testProject.slug);
  });

  it("should return null when project is not found", async () => {
    mockedModel.fetchBySlug.mockResolvedValue(null);

    const { result } = renderHook(() => useProject("non-existent-slug"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });

  it("should handle error state when fetchBySlug fails", async () => {
    const testError = new Error("Network error");
    mockedModel.fetchBySlug.mockRejectedValue(testError);

    const { result } = renderHook(() => useProject("crypto-screener"), {
      wrapper: createWrapper(),
    });

    // Esperamos a que React Query maneje el error
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(testError);
    expect(result.current.data).toBeUndefined();
  });

  it("should not fetch when slug is empty", async () => {
    mockedModel.fetchBySlug.mockResolvedValue(mockData[0]);

    const { result } = renderHook(() => useProject(""), {
      wrapper: createWrapper(),
    });

    // Should not be loading because query is disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(mockedModel.fetchBySlug).not.toHaveBeenCalled();
  });

  it("should pass correct slug to fetchBySlug", async () => {
    mockedModel.fetchBySlug.mockResolvedValue(mockData[0]);

    renderHook(() => useProject("portfolio-website"), {
      wrapper: createWrapper(),
    });

    await waitFor(() =>
      expect(mockedModel.fetchBySlug).toHaveBeenCalledWith("portfolio-website")
    );
  });
});
