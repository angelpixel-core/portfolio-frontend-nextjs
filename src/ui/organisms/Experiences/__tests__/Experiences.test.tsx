import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/domains/job-experience/queries", () => ({
  __esModule: true,
  useJobExperiences: jest.fn(),
}));

jest.mock("@/atoms/hocs", () => ({
  History: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="history-container">{children}</div>
  ),
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

import Experiences from "../index";
import { useJobExperiences } from "@/domains/job-experience/queries";
import type { JobExperience } from "@/domains/job-experience/model";

const mockedUseJobExperiences = useJobExperiences as jest.MockedFunction<
  typeof useJobExperiences
>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  TestWrapper.displayName = "TestQueryWrapper";

  return TestWrapper;
};

const makeExperience = (
  id: number,
  company: string,
  group: JobExperience["group"]
): JobExperience => ({
  id,
  position: `${company} Engineer`,
  company,
  companyLink: `https://${company.toLowerCase().replace(/\s+/g, "-")}.dev`,
  time: "Jan 2020 - Jan 2021",
  year: "2021",
  address: "Remote",
  contextBadges: ["Delivery"],
  technologies: ["TypeScript"],
  group,
  work: [{ description: `Built platform features at ${company}` }],
});

const buildQueryResult = (
  overrides: Partial<UseQueryResult<JobExperience[], Error>>
): UseQueryResult<JobExperience[], Error> =>
  ({
    data: undefined,
    error: null,
    isError: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isInitialLoading: false,
    isLoading: false,
    isLoadingError: false,
    isPaused: false,
    isPending: false,
    isPlaceholderData: false,
    isRefetchError: false,
    isRefetching: false,
    isStale: false,
    isSuccess: true,
    status: "success",
    fetchStatus: "idle",
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    refetch: jest.fn(),
    ...overrides,
  }) as unknown as UseQueryResult<JobExperience[], Error>;

describe("Experiences organism", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows section heading while loading", () => {
    mockedUseJobExperiences.mockReturnValue(
      buildQueryResult({
        isLoading: true,
        isInitialLoading: true,
        isSuccess: false,
        status: "pending",
      })
    );

    render(<Experiences />, { wrapper: createWrapper() });

    expect(
      screen.getByRole("heading", { level: 2, name: /Experiences/i })
    ).toBeInTheDocument();
  });

  it("renders grouped headings in engineering then platform order", async () => {
    mockedUseJobExperiences.mockReturnValue(
      buildQueryResult({
        data: [
          makeExperience(1, "Compass", "engineering"),
          makeExperience(2, "Nubi", "platform"),
          makeExperience(3, "SouthWorks", "engineering"),
        ],
      })
    );

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      const engineeringHeading = screen.getByRole("heading", {
        level: 3,
        name: "Selected Engineering Experience",
      });
      const platformHeading = screen.getByRole("heading", {
        level: 3,
        name: "Selected Platform Projects",
      });

      const engineeringBeforePlatform =
        engineeringHeading.compareDocumentPosition(platformHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING;

      expect(engineeringBeforePlatform).toBeTruthy();
    });
  });

  it("places each experience under its matching group heading", async () => {
    mockedUseJobExperiences.mockReturnValue(
      buildQueryResult({
        data: [
          makeExperience(1, "Compass", "engineering"),
          makeExperience(2, "Nubi", "platform"),
        ],
      })
    );

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      const engineeringHeading = screen.getByRole("heading", {
        level: 3,
        name: "Selected Engineering Experience",
      });
      const platformHeading = screen.getByRole("heading", {
        level: 3,
        name: "Selected Platform Projects",
      });

      const engineeringGroup = engineeringHeading.closest(".experiences-group");
      const platformGroup = platformHeading.closest(".experiences-group");

      expect(engineeringGroup).not.toBeNull();
      expect(platformGroup).not.toBeNull();

      expect(within(engineeringGroup as HTMLElement).getByText("Compass"));
      expect(
        within(engineeringGroup as HTMLElement).queryByText("Nubi")
      ).not.toBeInTheDocument();
      expect(within(platformGroup as HTMLElement).getByText("Nubi"));
      expect(
        within(platformGroup as HTMLElement).queryByText("Compass")
      ).not.toBeInTheDocument();
    });
  });

  it("omits group containers that have no entries", async () => {
    mockedUseJobExperiences.mockReturnValue(
      buildQueryResult({
        data: [
          makeExperience(1, "Compass", "engineering"),
          makeExperience(2, "SouthWorks", "engineering"),
        ],
      })
    );

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 3,
          name: "Selected Engineering Experience",
        })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", {
          level: 3,
          name: "Selected Platform Projects",
        })
      ).not.toBeInTheDocument();
    });
  });

  it("excludes entries that have unsupported group values", async () => {
    const invalidGroupExperience = {
      ...makeExperience(2, "Invalid Labs", "engineering"),
      group: "other",
    } as unknown as JobExperience;

    mockedUseJobExperiences.mockReturnValue(
      buildQueryResult({
        data: [
          makeExperience(1, "Compass", "engineering"),
          invalidGroupExperience,
        ],
      })
    );

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Compass")).toBeInTheDocument();
      expect(screen.queryByText("Invalid Labs")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", {
          level: 3,
          name: "Selected Platform Projects",
        })
      ).not.toBeInTheDocument();
    });
  });

  it("keeps fallback-only rendering when query fails", async () => {
    mockedUseJobExperiences.mockReturnValue(
      buildQueryResult({
        isSuccess: false,
        isError: true,
        status: "error",
        error: new Error("Network error"),
      })
    );

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByText(/Unable to load experiences/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", {
          level: 3,
          name: "Selected Engineering Experience",
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", {
          level: 3,
          name: "Selected Platform Projects",
        })
      ).not.toBeInTheDocument();
    });
  });

  it("renders a dedicated platform project card for platform group entries", async () => {
    mockedUseJobExperiences.mockReturnValue(
      buildQueryResult({
        data: [
          makeExperience(1, "Compass", "engineering"),
          makeExperience(2, "Zipline", "platform"),
        ],
      })
    );

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Compass")).toBeInTheDocument();
      expect(screen.getByText("Zipline")).toBeInTheDocument();
      expect(screen.getByTestId("platform-project-card")).toBeInTheDocument();
    });
  });
});
