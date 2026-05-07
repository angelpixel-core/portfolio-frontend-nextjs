import React, { type ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useProfile from "../useProfile";
import type { ProfileModel } from "../../model/schema";

const ORIGINAL_ENV = process.env;

// Create a wrapper with QueryClient
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
  return Wrapper;
}

describe("useProfile", () => {
  beforeEach(() => {
    process.env = {
      ...ORIGINAL_ENV,
      NEXT_PUBLIC_PROFILES: "file:profiles.json",
    };
    global.fetch = jest.fn();
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it("returns typed profile data when fetching by id", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        nickname: "portfolio-owner",
        authorName: "Angel Szymczak",
        biography: ["Bio line"],
        avatar: "/images/profile/hero.png",
        location: "Remote",
        email: "contact@angelpixel.io",
      }),
    });

    const { result } = renderHook(() => useProfile(1), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for data to load
    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 5000 }
    );

    // Data should be typed as ProfileModel
    const data: ProfileModel | null | undefined = result.current.data;
    expect(data).toBeDefined();
    expect(data?.nickname).toBe("portfolio-owner");
    expect(data?.biography).toBeInstanceOf(Array);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/profiles/1",
      expect.any(Object)
    );
  });

  it("is disabled when id is undefined", () => {
    const { result } = renderHook(() => useProfile(undefined), {
      wrapper: createWrapper(),
    });

    // Should not be loading when disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("can be enabled/disabled via options", () => {
    const { result } = renderHook(() => useProfile(1, { enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe("idle");
  });
});
