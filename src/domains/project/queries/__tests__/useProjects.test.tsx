import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import useProjects from "../useProjects";
import mockData from "../../model/mock";

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

describe("useProjects hook", () => {
  it("should fetch and return projects from mock data", async () => {
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
    expect((result.current.data as Array<{ title: string }>)?.[0].title).toBe(
      mockData[0].title
    );
  });
});
