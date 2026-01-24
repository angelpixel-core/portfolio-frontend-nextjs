import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useProjects from "../useProjects";
import mockData from "../../model/mock";
import type { ProjectsModel } from "../../model/schema";

// Mock the model module
jest.mock("../../model", () => ({
  __esModule: true,
  default: {
    fetchAll: jest.fn(),
  },
}));

import model from "../../model";

// Simula los timers de delay de mocks
jest.useFakeTimers();

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

describe("useProjects hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return projects from mock data", async () => {
    // Setup mock to return data after delay
    mockedModel.fetchAll.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockData), 2000);
        })
    );

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    // Inicialmente debería estar loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Avanzamos el timer de mock (2s)
    jest.advanceTimersByTime(2000);

    // Esperamos a que React Query resuelva
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(mockData.length);
    expect((result.current.data as ProjectsModel)?.[0].title).toBe(
      mockData[0].title
    );
  });

  it("should handle error state when fetchAll fails", async () => {
    const testError = new Error("Network error");
    mockedModel.fetchAll.mockRejectedValue(testError);

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    // Esperamos a que React Query maneje el error
    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(testError);
    expect(result.current.data).toBeUndefined();
  });
});
