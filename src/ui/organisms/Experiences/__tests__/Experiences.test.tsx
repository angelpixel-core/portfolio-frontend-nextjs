/**
 * Experiences Organism Tests
 * Story 3.1: Work History Timeline
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Use shared framer-motion mock - must be before component imports
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useReducedMotion from hooks
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

// Mock the job-experience model
jest.mock("@/domains/job-experience/model", () => ({
  __esModule: true,
  default: {
    fetchAll: jest.fn(),
  },
}));

// Mock the History and TransitionerLi HOCs to simplify testing
jest.mock("@/atoms/hocs", () => ({
  History: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="history-container">{children}</div>
  ),
  TransitionerLi: ({
    data,
    children,
  }: {
    data?: string;
    children: React.ReactNode;
  }) => (
    <li data-testid="transitioner-li">
      {children}
      {data && <p>{data}</p>}
    </li>
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
