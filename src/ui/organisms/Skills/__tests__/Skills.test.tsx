import React from "react";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Skills from "../index";

// Mock the useTechnologies hook
jest.mock("@/domains/technology/queries", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock useReducedMotion
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

import useTechnologies from "@/domains/technology/queries";

const mockUseTechnologies = useTechnologies as unknown as jest.Mock;

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
}

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

describe("Skills component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading skeleton when data is loading", () => {
    mockUseTechnologies.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    renderWithProviders(<Skills />);

    // Skeleton should be rendered via SkillsListSkeleton
    expect(document.querySelector(".skills-grid")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    mockUseTechnologies.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    renderWithProviders(<Skills />);

    expect(screen.getByText("Skills unavailable")).toBeInTheDocument();
  });

  it("renders error message when technologies array is empty", () => {
    mockUseTechnologies.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<Skills />);

    expect(screen.getByText("Skills unavailable")).toBeInTheDocument();
  });

  it("renders technologies when data is available", () => {
    const mockTechnologies = [
      { id: 0, name: "WWW", status: "active", x: "0vw", y: "0vw" },
      {
        id: 1,
        name: "React",
        status: "active",
        x: "14vw",
        y: "0vw",
        proficiency: "frontend",
      },
      {
        id: 2,
        name: "Ruby",
        status: "active",
        x: "8vw",
        y: "0vw",
        proficiency: "backend",
      },
    ];

    mockUseTechnologies.mockReturnValue({
      data: mockTechnologies,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<Skills />);

    // WWW is the center skill
    expect(screen.getByText("WWW")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Ruby")).toBeInTheDocument();
  });

  it("renders skills with correct CSS classes", () => {
    const mockTechnologies = [
      { id: 0, name: "WWW", status: "active", x: "0vw", y: "0vw" },
      {
        id: 1,
        name: "TypeScript",
        status: "active",
        x: "10vw",
        y: "5vw",
        proficiency: "frontend",
      },
    ];

    mockUseTechnologies.mockReturnValue({
      data: mockTechnologies,
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<Skills />);

    // Check that the skills-grid container is present
    const skillsGrid = document.querySelector(".skills-grid");
    expect(skillsGrid).toBeInTheDocument();
  });
});
