import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/domains/job-experience/model", () => ({
  __esModule: true,
  default: {
    fetchAll: jest.fn(),
  },
}));

jest.mock("@/domains/job-experience/queries", () => {
  const actual = jest.requireActual(
    "@/domains/job-experience/queries/useJobExperiences"
  );
  return {
    __esModule: true,
    useJobExperiences: actual.default,
  };
});

jest.mock("@/atoms/hocs", () => ({
  History: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="history-container">{children}</div>
  ),
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

import Experiences from "../index";
import model from "@/domains/job-experience/model";
import type { JobExperience } from "@/domains/job-experience/model";

const mockedModel = model as jest.Mocked<typeof model>;

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

describe("Experiences organism", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows section heading while loading", () => {
    mockedModel.fetchAll.mockImplementation(() => new Promise(() => {}));

    render(<Experiences />, { wrapper: createWrapper() });

    expect(
      screen.getByRole("heading", { level: 2, name: /Experiences/i })
    ).toBeInTheDocument();
  });

  it("renders grouped headings in engineering then platform order", async () => {
    mockedModel.fetchAll.mockResolvedValue([
      makeExperience(1, "Compass", "engineering"),
      makeExperience(2, "Nubi", "platform"),
      makeExperience(3, "SouthWorks", "engineering"),
    ]);

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      const engineeringHeading = screen.getByRole("heading", {
        level: 3,
        name: "Engineering",
      });
      const platformHeading = screen.getByRole("heading", {
        level: 3,
        name: "Platform",
      });

      const engineeringBeforePlatform =
        engineeringHeading.compareDocumentPosition(platformHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING;

      expect(engineeringBeforePlatform).toBeTruthy();
    });
  });

  it("places each experience under its matching group heading", async () => {
    mockedModel.fetchAll.mockResolvedValue([
      makeExperience(1, "Compass", "engineering"),
      makeExperience(2, "Nubi", "platform"),
    ]);

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      const engineeringHeading = screen.getByRole("heading", {
        level: 3,
        name: "Engineering",
      });
      const platformHeading = screen.getByRole("heading", {
        level: 3,
        name: "Platform",
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
    mockedModel.fetchAll.mockResolvedValue([
      makeExperience(1, "Compass", "engineering"),
      makeExperience(2, "SouthWorks", "engineering"),
    ]);

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 3, name: "Engineering" })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { level: 3, name: "Platform" })
      ).not.toBeInTheDocument();
    });
  });

  it("excludes entries that have unsupported group values", async () => {
    const invalidGroupExperience = {
      ...makeExperience(2, "Invalid Labs", "engineering"),
      group: "other",
    } as unknown as JobExperience;

    mockedModel.fetchAll.mockResolvedValue([
      makeExperience(1, "Compass", "engineering"),
      invalidGroupExperience,
    ]);

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Compass")).toBeInTheDocument();
      expect(screen.queryByText("Invalid Labs")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { level: 3, name: "Platform" })
      ).not.toBeInTheDocument();
    });
  });

  it("keeps fallback-only rendering when query fails", async () => {
    mockedModel.fetchAll.mockRejectedValue(new Error("Network error"));

    render(<Experiences />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByText(/Unable to load experiences/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { level: 3, name: "Engineering" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("heading", { level: 3, name: "Platform" })
      ).not.toBeInTheDocument();
    });
  });
});
