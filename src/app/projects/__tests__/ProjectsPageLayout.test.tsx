/**
 * Projects Page Layout Tests
 * Story 14.2: Projects Page Layout
 *
 * Tests specifically for the 6-project limit and edge cases.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
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

// Generate mock projects for testing limits
const generateProjects = (count: number, featuredIndex: number = 0) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    slug: `project-${i + 1}`,
    title: `Project ${i + 1}`,
    summary: `Summary for project ${i + 1}`,
    description: "Description",
    technologies: ["React"],
    img: `/img${i + 1}.jpg`,
    tags: "Test",
    featured: i === featuredIndex,
    demo: undefined,
    repository: undefined,
  }));

// Default mock with 10 projects (more than limit)
let mockProjects = generateProjects(10, 0);

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

describe("ProjectsPage - 6 Project Limit (AC5)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockSearchParams = new URLSearchParams();
    mockPush.mockClear();
    mockProjects = generateProjects(10, 0);
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectsPage />
      </QueryClientProvider>
    );

  it("limits displayed projects to maximum of 6", () => {
    renderPage();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Imagination Trumps Knowledge!/i,
      })
    ).toBeInTheDocument();

    // Should only show 6 projects (1 featured + 5 non-featured = max 6)
    // Featured project
    expect(screen.getByText("Project 1")).toBeInTheDocument();

    // Non-featured in grid (projects 2-6)
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(screen.getByText("Project 3")).toBeInTheDocument();
    expect(screen.getByText("Project 4")).toBeInTheDocument();
    expect(screen.getByText("Project 5")).toBeInTheDocument();
    expect(screen.getByText("Project 6")).toBeInTheDocument();

    // Project 7+ should NOT be shown
    expect(screen.queryByText("Project 7")).not.toBeInTheDocument();
    expect(screen.queryByText("Project 10")).not.toBeInTheDocument();
  });

  it("prioritizes featured projects in the limit", () => {
    // Set featured at index 5 (Project 6)
    mockProjects = generateProjects(10, 5);
    renderPage();

    // Featured project (Project 6) should be shown
    const featuredContainer = document.querySelector(
      ".projects-blade__featured"
    );
    expect(featuredContainer).toBeInTheDocument();

    // Project 6 (featured) should be in featured section
    expect(screen.getByText("Project 6")).toBeInTheDocument();
  });

  it("prioritizes multiple featured projects over non-featured in limit", () => {
    // Create 10 projects: first 3 are featured, rest are not
    mockProjects = generateProjects(10, -1).map((p, i) => ({
      ...p,
      featured: i < 3, // First 3 are featured
    }));
    renderPage();

    // Should show first 3 featured + 3 non-featured = 6 total
    // Featured projects (1, 2, 3) should all be shown
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(screen.getByText("Project 3")).toBeInTheDocument();

    // Non-featured projects (4, 5, 6) should be shown
    expect(screen.getByText("Project 4")).toBeInTheDocument();
    expect(screen.getByText("Project 5")).toBeInTheDocument();
    expect(screen.getByText("Project 6")).toBeInTheDocument();

    // Project 7+ should NOT be shown (limit is 6)
    expect(screen.queryByText("Project 7")).not.toBeInTheDocument();
    expect(screen.queryByText("Project 10")).not.toBeInTheDocument();

    // Verify featured projects are prioritized: if we had 4 featured, all 4 would show
    // and only 2 non-featured would fit in the limit
  });
});

describe("ProjectsPage - Variable Project Counts (AC4)", () => {
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

  it("handles 1 project gracefully", () => {
    mockProjects = generateProjects(1, 0);
    renderPage();

    expect(screen.getByText("Project 1")).toBeInTheDocument();
    // Grid section should not exist with only 1 (featured) project
    const gridSection = document.querySelector(".projects-blade--grid");
    expect(gridSection).not.toBeInTheDocument();
  });

  it("handles 3 projects gracefully", () => {
    mockProjects = generateProjects(3, 0);
    renderPage();

    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(screen.getByText("Project 3")).toBeInTheDocument();
  });

  it("handles exactly 6 projects", () => {
    mockProjects = generateProjects(6, 0);
    renderPage();

    // All 6 should be visible
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Project ${i}`)).toBeInTheDocument();
    }
  });

  it("handles no featured project", () => {
    // All projects non-featured (set featured index out of range)
    mockProjects = generateProjects(4, -1);
    renderPage();

    // All projects should still render
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();

    // Featured container should not have featured card
    const featuredSection = document.querySelector(".projects-blade__featured");
    expect(featuredSection).not.toBeInTheDocument();
  });

  it("handles all featured projects", () => {
    // Make all projects featured
    mockProjects = generateProjects(3, -1).map((p) => ({
      ...p,
      featured: true,
    }));
    renderPage();

    // Only first featured should be in featured section, rest in grid
    const featuredCard = document.querySelector(".project-card--featured");
    expect(featuredCard).toBeInTheDocument();
  });
});

describe("ProjectsPage - Grid Layout (AC3)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockSearchParams = new URLSearchParams();
    mockPush.mockClear();
    mockProjects = generateProjects(6, 0);
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ProjectsPage />
      </QueryClientProvider>
    );

  it("renders non-featured projects in grid container", () => {
    renderPage();

    const grid = document.querySelector(".projects-grid");
    expect(grid).toBeInTheDocument();

    const gridItems = document.querySelectorAll(".projects-grid__item");
    expect(gridItems.length).toBe(5); // 6 total - 1 featured = 5 in grid
  });

  it("separates featured from grid projects", () => {
    renderPage();

    // Featured in hero blade
    const featuredSection = document.querySelector(".projects-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Non-featured in grid blade
    const gridSection = document.querySelector(".projects-blade--grid");
    expect(gridSection).toBeInTheDocument();
  });
});
