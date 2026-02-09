/**
 * Experiences Organism Tests
 * Story 3.1: Work History Timeline
 * Story 3.2: Role Details & Responsibilities
 */

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Use shared framer-motion mock - must be before component imports
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useReducedMotion from hooks
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

// Mock the job-experience model (must be declared before queries mock)
jest.mock("@/domains/job-experience/model", () => ({
  __esModule: true,
  default: {
    fetchAll: jest.fn(),
  },
}));

// Mock the job-experience queries barrel.
// The component imports as: import { useJobExperiences } from "@/domains/job-experience/queries"
// Re-export the actual hook as a named export.
jest.mock("@/domains/job-experience/queries", () => {
  const actual = jest.requireActual(
    "@/domains/job-experience/queries/useJobExperiences"
  );
  return {
    __esModule: true,
    useJobExperiences: actual.default,
  };
});

// Mock the History and TransitionerLi HOCs to simplify testing
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
import mockData from "@/domains/job-experience/model/mock";

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

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  TestWrapper.displayName = "TestQueryWrapper";
  return TestWrapper;
};

describe("Experiences organism (Story 3.1)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading state", () => {
    it("shows skeleton while loading", () => {
      mockedModel.fetchAll.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<Experiences />, { wrapper: createWrapper() });

      expect(
        screen.getByRole("heading", { name: /Experiences/i })
      ).toBeInTheDocument();
    });
  });

  describe("Error state", () => {
    it("shows error message when fetch fails", async () => {
      mockedModel.fetchAll.mockRejectedValue(new Error("Network error"));

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText(/Unable to load experiences/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Success state", () => {
    it("renders all 6 job experiences", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        // Check for company names
        expect(screen.getByText(/@Consulting Service/i)).toBeInTheDocument();
        expect(screen.getByText(/@Compass/i)).toBeInTheDocument();
        expect(screen.getByText(/@SouthWorks/i)).toBeInTheDocument();
        expect(screen.getByText(/@Nubi/i)).toBeInTheDocument();
        expect(screen.getByText(/@Bitex/i)).toBeInTheDocument();
        expect(screen.getByText(/@UNLP/i)).toBeInTheDocument();
      });
    });

    it("renders experiences in reverse chronological order", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        const links = screen.getAllByRole("link");
        const companyLinks = links.filter((link) =>
          link.textContent?.startsWith("@")
        );

        // First should be Consulting Service (newest)
        expect(companyLinks[0]).toHaveTextContent("@Consulting Service");
        // Last should be UNLP (oldest)
        expect(companyLinks[companyLinks.length - 1]).toHaveTextContent(
          "@UNLP"
        );
      });
    });

    it("renders section with proper heading", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        const heading = screen.getByRole("heading", {
          level: 2,
          name: /Experiences/i,
        });
        expect(heading).toBeInTheDocument();
      });
    });

    it("renders section with accessibility attributes", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      const { container } = render(<Experiences />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        const section = container.querySelector("section");
        expect(section).toHaveAttribute(
          "aria-labelledby",
          "experiences-heading"
        );
        expect(section).toHaveAttribute(
          "aria-label",
          "Professional work history"
        );
      });
    });
  });

  describe("Empty state", () => {
    it("shows error message when no experiences", async () => {
      mockedModel.fetchAll.mockResolvedValue([]);

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText(/Unable to load experiences/i)
        ).toBeInTheDocument();
      });
    });
  });
});

describe("Experiences organism - Expand/Collapse (Story 3.2)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Expandable experiences", () => {
    it("renders expand button for all experiences with work items", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        // All 6 experiences in mock data have work items
        const expandButtons = screen.getAllByRole("button", {
          name: /show details/i,
        });
        expect(expandButtons.length).toBe(6);
      });
    });

    it("allows expanding individual experiences", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        const expandButtons = screen.getAllByRole("button", {
          name: /show details/i,
        });
        fireEvent.click(expandButtons[0]);
      });

      // First experience (Consulting Service) should show details
      await waitFor(() => {
        expect(
          screen.getByText(/collaborated with Chief Technology Officers/i)
        ).toBeInTheDocument();
      });
    });

    it("allows multiple experiences to be open simultaneously", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      render(<Experiences />, { wrapper: createWrapper() });

      await waitFor(() => {
        const expandButtons = screen.getAllByRole("button", {
          name: /show details/i,
        });
        // Expand first experience
        fireEvent.click(expandButtons[0]);
        // Expand second experience
        fireEvent.click(expandButtons[1]);
      });

      // Both experiences should be open
      await waitFor(() => {
        // First experience content (Consulting Service)
        expect(
          screen.getByText(/collaborated with Chief Technology Officers/i)
        ).toBeInTheDocument();
        // Second experience content (Compass)
        expect(
          screen.getByText(/code maintenance and enhancement/i)
        ).toBeInTheDocument();
      });

      // Both should show "Hide details" buttons
      const hideButtons = screen.getAllByRole("button", {
        name: /hide details/i,
      });
      expect(hideButtons.length).toBe(2);
    });

    it("allows collapsing individual experiences independently", async () => {
      mockedModel.fetchAll.mockResolvedValue(mockData);

      render(<Experiences />, { wrapper: createWrapper() });

      // Open first two experiences
      await waitFor(() => {
        const expandButtons = screen.getAllByRole("button", {
          name: /show details/i,
        });
        fireEvent.click(expandButtons[0]);
        fireEvent.click(expandButtons[1]);
      });

      // Collapse first experience only
      await waitFor(() => {
        const hideButtons = screen.getAllByRole("button", {
          name: /hide details/i,
        });
        fireEvent.click(hideButtons[0]);
      });

      // First experience should be collapsed, second still open
      await waitFor(() => {
        expect(
          screen.queryByText(/collaborated with Chief Technology Officers/i)
        ).not.toBeInTheDocument();
        expect(
          screen.getByText(/code maintenance and enhancement/i)
        ).toBeInTheDocument();
      });
    });
  });
});
