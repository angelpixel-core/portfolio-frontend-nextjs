/**
 * Projects Page Filtering Tests
 * Story 2.4: Project Filtering by Technology
 *
 * Tests the filtering logic integration in the projects page.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock useSearchParams and useRouter
const mockPush = jest.fn();
let mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Mock useProjects hook with test data
const mockProjects = [
  {
    id: 1,
    slug: "react-project",
    title: "React Project",
    summary: "A React project",
    description: "Description",
    technologies: ["React", "TypeScript"],
    img: "/img1.jpg",
    tags: "Frontend",
    featured: true,
    demo: undefined,
    repository: undefined,
  },
  {
    id: 2,
    slug: "vue-project",
    title: "Vue Project",
    summary: "A Vue project",
    description: "Description",
    technologies: ["Vue", "JavaScript"],
    img: "/img2.jpg",
    tags: "Frontend",
    featured: false,
    demo: undefined,
    repository: undefined,
  },
  {
    id: 3,
    slug: "fullstack-project",
    title: "Fullstack Project",
    summary: "A fullstack project",
    description: "Description",
    technologies: ["React", "Node.js", "PostgreSQL"],
    img: "/img3.jpg",
    tags: "Fullstack",
    featured: false,
    demo: undefined,
    repository: undefined,
  },
];

jest.mock("@/hooks", () => ({
  useProjects: () => ({
    data: mockProjects,
    isLoading: false,
    isError: false,
  }),
}));

import ProjectsPage from "../page";

describe("ProjectsPage - Filtering (Story 2.4)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockSearchParams = new URLSearchParams();
    mockPush.mockClear();
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectsPage />
      </QueryClientProvider>
    );

  describe("Initial render", () => {
    it("displays all projects when no filters selected", () => {
      renderPage();

      expect(screen.getByText("React Project")).toBeInTheDocument();
      expect(screen.getByText("Vue Project")).toBeInTheDocument();
      expect(screen.getByText("Fullstack Project")).toBeInTheDocument();
    });

    it("displays technology filter chips", () => {
      renderPage();

      // Check for unique technologies from all projects
      expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Vue" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "TypeScript" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "JavaScript" })
      ).toBeInTheDocument();
    });
  });

  describe("Single filter", () => {
    it("filters projects when a technology is selected", () => {
      mockSearchParams = new URLSearchParams("tech=Vue");
      renderPage();

      // Vue Project should be visible
      expect(screen.getByText("Vue Project")).toBeInTheDocument();

      // React-only projects should not be visible
      expect(screen.queryByText("React Project")).not.toBeInTheDocument();
    });

    it("updates URL when filter chip is clicked", async () => {
      renderPage();

      const vueChip = screen.getByRole("button", { name: "Vue" });
      fireEvent.click(vueChip);

      expect(mockPush).toHaveBeenCalledWith("/projects?tech=Vue", {
        scroll: false,
      });
    });

    it("shows filter count when filters are active", () => {
      mockSearchParams = new URLSearchParams("tech=React");
      renderPage();

      // Should show "Showing X of Y projects"
      expect(screen.getByText(/showing 2 of 3 projects/i)).toBeInTheDocument();
    });
  });

  describe("Multiple filters (OR logic)", () => {
    it("shows projects matching ANY selected technology", () => {
      mockSearchParams = new URLSearchParams("tech=Vue&tech=PostgreSQL");
      renderPage();

      // Vue Project has Vue
      expect(screen.getByText("Vue Project")).toBeInTheDocument();
      // Fullstack Project has PostgreSQL
      expect(screen.getByText("Fullstack Project")).toBeInTheDocument();
      // React Project has neither Vue nor PostgreSQL
      expect(screen.queryByText("React Project")).not.toBeInTheDocument();
    });

    it("appends tech to URL when adding filter", async () => {
      mockSearchParams = new URLSearchParams("tech=React");
      renderPage();

      const vueChip = screen.getByRole("button", { name: "Vue" });
      fireEvent.click(vueChip);

      expect(mockPush).toHaveBeenCalledWith("/projects?tech=React&tech=Vue", {
        scroll: false,
      });
    });
  });

  describe("Clear filters", () => {
    it("shows Clear All button when filters active", () => {
      mockSearchParams = new URLSearchParams("tech=React");
      renderPage();

      expect(
        screen.getByRole("button", { name: /clear all/i })
      ).toBeInTheDocument();
    });

    it("removes all filters when Clear All clicked", () => {
      mockSearchParams = new URLSearchParams("tech=React&tech=Vue");
      renderPage();

      const clearButton = screen.getByRole("button", { name: /clear all/i });
      fireEvent.click(clearButton);

      expect(mockPush).toHaveBeenCalledWith("/projects", { scroll: false });
    });

    it("hides Clear All button when no filters active", () => {
      renderPage();

      expect(
        screen.queryByRole("button", { name: /clear all/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("shows empty message when no projects match filters", () => {
      mockSearchParams = new URLSearchParams("tech=NonExistent");
      renderPage();

      expect(
        screen.getByText(/no projects match the selected filters/i)
      ).toBeInTheDocument();
    });
  });

  describe("URL persistence", () => {
    it("restores filter state from URL on load", () => {
      mockSearchParams = new URLSearchParams("tech=TypeScript");
      renderPage();

      // TypeScript chip should be marked as active
      const tsChip = screen.getByRole("button", { name: "TypeScript" });
      expect(tsChip).toHaveAttribute("aria-pressed", "true");

      // Only projects with TypeScript should show
      expect(screen.getByText("React Project")).toBeInTheDocument();
      expect(screen.queryByText("Vue Project")).not.toBeInTheDocument();
    });
  });
});
