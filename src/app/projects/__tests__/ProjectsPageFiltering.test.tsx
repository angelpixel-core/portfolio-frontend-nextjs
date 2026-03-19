/**
 * Projects Page Filtering Tests
 * Story 2.4: Project Filtering by Technology
 * Story 14.2: Projects Page Layout
 *
 * Tests the filtering logic and blade-based layout in the projects page.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ProjectModel } from "@/domains/project/model/schema";

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

const createProject = (
  overrides: Partial<ProjectModel> = {}
): ProjectModel => ({
  id: 1,
  slug: "project-1",
  title: "Project 1",
  summary: "Project summary",
  description: "Project description",
  technologies: ["React"],
  img: "/img-default.jpg",
  tags: "Frontend",
  featured: false,
  demo: undefined,
  repository: undefined,
  ...overrides,
});

const baseProjects = (): ProjectModel[] => [
  createProject({
    id: 1,
    slug: "react-project",
    title: "React Project",
    summary: "A React project",
    technologies: ["React", "TypeScript"],
    img: "/img1.jpg",
    featured: true,
  }),
  createProject({
    id: 2,
    slug: "vue-project",
    title: "Vue Project",
    summary: "A Vue project",
    technologies: ["Vue", "JavaScript"],
    img: "/img2.jpg",
  }),
  createProject({
    id: 3,
    slug: "fullstack-project",
    title: "Fullstack Project",
    summary: "A fullstack project",
    technologies: ["React", "Node.js", "PostgreSQL"],
    img: "/img3.jpg",
    tags: "Fullstack",
  }),
];

// Mock useProjects hook with test data
let mockProjects = baseProjects();

// Mock domain hook: useProjects (named export from domain queries)
jest.mock("@/domains/project/queries", () => ({
  useProjects: () => ({
    data: mockProjects,
    isLoading: false,
    isError: false,
  }),
}));

// Mock UI hooks from @/hooks barrel
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
  useTransition: () => ({
    canAnimate: true,
    isInitialLoad: false,
    phase: "idle",
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
    mockProjects = baseProjects();
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

      // Check curated chips list
      expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "TypeScript" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Node.js" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Tailwind" })
      ).toBeInTheDocument();
    });
  });

  describe("Single filter", () => {
    it("filters projects when a technology is selected", () => {
      mockSearchParams = new URLSearchParams("tech=Node.js");
      renderPage();

      // Fullstack Project should be visible
      expect(screen.getByText("Fullstack Project")).toBeInTheDocument();

      // React-only project should not be visible
      expect(screen.queryByText("React Project")).not.toBeInTheDocument();
    });

    it("updates URL when filter chip is clicked", async () => {
      renderPage();

      const nodeChip = screen.getByRole("button", { name: "Node.js" });
      fireEvent.click(nodeChip);

      expect(mockPush).toHaveBeenCalledWith("/projects?tech=Node.js&page=1", {
        scroll: false,
      });
    });

    it("shows filter count when filters are active", () => {
      mockSearchParams = new URLSearchParams("tech=React");
      renderPage();

      // Should show "Showing X of Y projects" (2 projects match React: React Project and Fullstack Project)
      expect(screen.getByText(/showing 2 of 2 projects/i)).toBeInTheDocument();
    });
  });

  describe("Multiple filters (OR logic)", () => {
    it("shows projects matching ANY selected technology", () => {
      mockSearchParams = new URLSearchParams("tech=React&tech=PostgreSQL");
      renderPage();

      // Fullstack Project has PostgreSQL and React
      expect(screen.getByText("Fullstack Project")).toBeInTheDocument();
      // React Project has React
      expect(screen.getByText("React Project")).toBeInTheDocument();
    });

    it("appends tech to URL when adding filter", async () => {
      mockSearchParams = new URLSearchParams("tech=React");
      renderPage();

      const nodeChip = screen.getByRole("button", { name: "Node.js" });
      fireEvent.click(nodeChip);

      expect(mockPush).toHaveBeenCalledWith(
        "/projects?tech=React&tech=Node.js&page=1",
        {
          scroll: false,
        }
      );
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
      mockSearchParams = new URLSearchParams("tech=React&tech=Node.js");
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

  describe("Ordering priority", () => {
    it("orders featured first, incoming next, then standard with stable order", () => {
      mockProjects = [
        createProject({
          id: 1,
          slug: "standard-one",
          title: "Standard One",
          technologies: ["React"],
        }),
        createProject({
          id: 2,
          slug: "incoming-one",
          title: "Incoming One",
          technologies: ["React"],
          featuredCard: { ribbon: { text: "Incoming" } },
        }),
        createProject({
          id: 3,
          slug: "featured-one",
          title: "Featured One",
          technologies: ["React"],
          featured: true,
        }),
        createProject({
          id: 4,
          slug: "incoming-two",
          title: "Incoming Two",
          technologies: ["React"],
          featuredCard: { ribbon: { text: "Incoming" } },
        }),
        createProject({
          id: 5,
          slug: "standard-two",
          title: "Standard Two",
          technologies: ["React"],
        }),
      ];

      renderPage();

      const titles = screen
        .getAllByTestId("project-card-title")
        .map((node) => node.textContent);

      expect(titles).toEqual([
        "Featured One",
        "Incoming One",
        "Incoming Two",
        "Standard One",
        "Standard Two",
      ]);
    });
  });

  describe("Pagination", () => {
    it("applies page slice after filters", () => {
      mockProjects = Array.from({ length: 8 }, (_, index) =>
        createProject({
          id: index + 1,
          slug: `react-${index + 1}`,
          title: `React ${index + 1}`,
          technologies: ["React"],
        })
      );

      mockSearchParams = new URLSearchParams("tech=React&page=2");
      renderPage();

      const titles = screen
        .getAllByTestId("project-card-title")
        .map((node) => node.textContent);

      expect(titles).toEqual(["React 7", "React 8"]);
    });

    it("renders empty grid when page is out of range", () => {
      mockProjects = Array.from({ length: 8 }, (_, index) =>
        createProject({
          id: index + 1,
          slug: `react-${index + 1}`,
          title: `React ${index + 1}`,
          technologies: ["React"],
        })
      );

      mockSearchParams = new URLSearchParams("tech=React&page=3");
      renderPage();

      expect(screen.queryAllByTestId("projects-grid-item")).toHaveLength(0);
      expect(
        screen.getByText(/no projects match the selected filters/i)
      ).toBeInTheDocument();
    });
  });

  describe("Page parameter persistence", () => {
    it("preserves tech params when updating page", () => {
      mockProjects = Array.from({ length: 7 }, (_, index) =>
        createProject({
          id: index + 1,
          slug: `react-${index + 1}`,
          title: `React ${index + 1}`,
          technologies: ["React"],
        })
      );

      mockSearchParams = new URLSearchParams("tech=React&tech=Node.js&page=1");
      renderPage();

      const pageTwo = screen.getByRole("button", { name: "2" });
      fireEvent.click(pageTwo);

      expect(mockPush).toHaveBeenCalledWith(
        "/projects?tech=React&tech=Node.js&page=2",
        { scroll: false }
      );
    });

    it("defaults to page 1 when missing without altering filters", () => {
      mockProjects = Array.from({ length: 7 }, (_, index) =>
        createProject({
          id: index + 1,
          slug: `react-${index + 1}`,
          title: `React ${index + 1}`,
          technologies: ["React"],
        })
      );

      mockSearchParams = new URLSearchParams("tech=React");
      renderPage();

      expect(screen.getByRole("button", { name: "1" })).toBeDisabled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Count copy", () => {
    it("shows total filtered count independent of page size", () => {
      mockProjects = Array.from({ length: 8 }, (_, index) =>
        createProject({
          id: index + 1,
          slug: `react-${index + 1}`,
          title: `React ${index + 1}`,
          technologies: ["React"],
        })
      );

      mockSearchParams = new URLSearchParams("tech=React&page=1");
      renderPage();

      expect(screen.getByText(/showing 6 of 8 projects/i)).toBeInTheDocument();
    });

    it("shows zero count when filters yield no results", () => {
      mockSearchParams = new URLSearchParams("tech=NonExistent");
      renderPage();

      expect(screen.getByText(/showing 0 of 0 projects/i)).toBeInTheDocument();
    });
  });
});

/**
 * Story 14.2: Projects Page Layout Tests
 */
describe("ProjectsPage - Layout (Story 14.2)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockSearchParams = new URLSearchParams();
    mockProjects = baseProjects();
    mockPush.mockClear();
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectsPage />
      </QueryClientProvider>
    );

  describe("Blade structure (AC1, AC6)", () => {
    it("renders hero blade with title, filter and featured project", () => {
      renderPage();

      // Should have blade structure
      const heroSection = document.querySelector(".projects-blade--hero");
      expect(heroSection).toBeInTheDocument();

      // Title should be in hero blade (AC6)
      const title = heroSection?.querySelector(".projects-title");
      expect(title).toBeInTheDocument();

      // Filter should be in hero blade
      const filterWrapper = document.querySelector(
        ".projects-blade__filter-wrapper"
      );
      expect(filterWrapper).toBeInTheDocument();

      // Featured project should be in hero blade
      const featuredWrapper = document.querySelector(
        ".projects-blade__featured"
      );
      expect(featuredWrapper).toBeInTheDocument();
    });

    it("renders grid blade for non-featured projects", () => {
      renderPage();

      // Should have grid blade
      const gridSection = document.querySelector(".projects-blade--grid");
      expect(gridSection).toBeInTheDocument();

      // Grid should contain project items
      const gridItems = document.querySelectorAll(".projects-grid__item");
      expect(gridItems.length).toBe(2); // Vue and Fullstack (non-featured)
    });
  });

  describe("Featured project separation (AC1)", () => {
    it("separates featured project from grid projects", () => {
      renderPage();

      // Featured project should render in featured container
      const featuredContainer = document.querySelector(
        ".projects-blade__featured"
      );
      expect(featuredContainer).toBeInTheDocument();
      expect(
        featuredContainer?.querySelector(".project-card--featured")
      ).toBeInTheDocument();

      // Non-featured should be in grid
      const gridItems = document.querySelectorAll(".projects-grid__item");
      gridItems.forEach((item) => {
        expect(
          item.querySelector(".project-card--featured")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Filter full width (AC2)", () => {
    it("renders filter in full-width wrapper", () => {
      renderPage();

      const filterWrapper = document.querySelector(
        ".projects-blade__filter-wrapper"
      );
      expect(filterWrapper).toBeInTheDocument();
      expect(filterWrapper).toHaveClass("projects-blade__filter-wrapper");
    });
  });
});
