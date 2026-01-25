/**
 * useAcademics Hook Tests
 * Story 3.3: Academic Background
 */

import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import useAcademics from "../useAcademics";
import model from "../../model";

// Mock the model
jest.mock("../../model", () => ({
  __esModule: true,
  default: {
    fetchAll: jest.fn(),
  },
}));

const mockedModel = model as jest.Mocked<typeof model>;

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  TestWrapper.displayName = "TestQueryWrapper";
  return TestWrapper;
};

describe("useAcademics hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns loading state initially", () => {
    mockedModel.fetchAll.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useAcademics(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("returns data on successful fetch", async () => {
    const mockData = [
      {
        id: 1,
        degree: "Bachelor Of Science",
        institution: "University",
        start_date: "2013",
        end_date: "2017",
        resume: "Description",
      },
    ];
    mockedModel.fetchAll.mockResolvedValue(mockData);

    const { result } = renderHook(() => useAcademics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.isLoading).toBe(false);
  });

  it("returns error state on fetch failure", async () => {
    mockedModel.fetchAll.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useAcademics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("uses correct query key", async () => {
    const mockData = [
      {
        id: 1,
        degree: "Test",
        institution: "Test",
        start_date: "2020",
        end_date: "2021",
      },
    ];
    mockedModel.fetchAll.mockResolvedValue(mockData);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children
      );

    renderHook(() => useAcademics(), { wrapper });

    await waitFor(() => {
      const queryData = queryClient.getQueryData(["academics"]);
      expect(queryData).toEqual(mockData);
    });
  });
});
