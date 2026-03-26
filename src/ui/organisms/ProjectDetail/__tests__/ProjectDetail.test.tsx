import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock next/image before importing component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
  }) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  },
}));

import ProjectDetail from "../index";
import type { ProjectModel } from "@/domains/project/model/schema";

describe("ProjectDetail", () => {
  const mockProject: ProjectModel = {
    id: 1,
    slug: "test-project",
    title: "Test Project",
    summary: "A test project summary",
    description:
      "This is a full description of the test project with all details.",
    technologies: ["React", "TypeScript", "Node.js"],
    outcomes: "Achieved 50% performance improvement",
    technicalHighlights: [
      "Real-time data stream",
      "Client-side cache",
      "Chart system",
      "Modular UI",
    ],
    demo: "https://test-demo.com",
    repository: "https://github.com/test/project",
    img: "/images/test-project.jpg",
    screenshots: ["/images/screenshot1.jpg", "/images/screenshot2.jpg"],
    tags: "Web App • TypeScript • React",
    featured: true,
    visible: true,
    priority: 1,
    status: "live",
  };

  it("renders project title", () => {
    render(<ProjectDetail project={mockProject} />);
    expect(
      screen.getByRole("heading", { level: 1, name: mockProject.title })
    ).toBeInTheDocument();
  });

  it("renders project tags", () => {
    render(<ProjectDetail project={mockProject} />);
    expect(screen.getByText(mockProject.tags)).toBeInTheDocument();
  });

  it("renders project description", () => {
    render(<ProjectDetail project={mockProject} />);
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
  });

  it("renders all technologies", () => {
    render(<ProjectDetail project={mockProject} />);
    mockProject.technologies.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it("renders outcomes when present", () => {
    render(<ProjectDetail project={mockProject} />);
    expect(screen.getByText(mockProject.outcomes!)).toBeInTheDocument();
  });

  it("does not render outcomes section when not present", () => {
    const projectWithoutOutcomes = { ...mockProject, outcomes: undefined };
    render(<ProjectDetail project={projectWithoutOutcomes} />);
    expect(screen.queryByText("Outcomes")).not.toBeInTheDocument();
  });

  it("renders main project image", () => {
    render(<ProjectDetail project={mockProject} />);
    const image = screen.getByAltText(`${mockProject.title} preview`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", mockProject.img);
  });

  it("renders screenshots when present", () => {
    render(<ProjectDetail project={mockProject} />);
    expect(
      screen.getByAltText(`${mockProject.title} screenshot 1`)
    ).toBeInTheDocument();
    expect(
      screen.getByAltText(`${mockProject.title} screenshot 2`)
    ).toBeInTheDocument();
  });

  it("does not render screenshots section when not present", () => {
    const projectWithoutScreenshots = {
      ...mockProject,
      screenshots: undefined,
    };
    render(<ProjectDetail project={projectWithoutScreenshots} />);
    expect(screen.queryByText("Screenshots")).not.toBeInTheDocument();
  });

  it("renders demo link when present", () => {
    render(<ProjectDetail project={mockProject} />);
    const demoLink = screen.getByRole("link", { name: "View Demo" });
    expect(demoLink).toBeInTheDocument();
    expect(demoLink).toHaveAttribute("href", mockProject.demo);
    expect(demoLink).toHaveAttribute("target", "_blank");
    expect(demoLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders repository link when present", () => {
    render(<ProjectDetail project={mockProject} />);
    const repoLink = screen.getByRole("link", { name: "View Repository" });
    expect(repoLink).toBeInTheDocument();
    expect(repoLink).toHaveAttribute("href", mockProject.repository);
    expect(repoLink).toHaveAttribute("target", "_blank");
  });

  it("does not render demo link when not present", () => {
    const projectWithoutDemo = { ...mockProject, demo: undefined };
    render(<ProjectDetail project={projectWithoutDemo} />);
    expect(
      screen.queryByRole("link", { name: "View Demo" })
    ).not.toBeInTheDocument();
  });

  it("does not render repository link when not present", () => {
    const projectWithoutRepo = { ...mockProject, repository: undefined };
    render(<ProjectDetail project={projectWithoutRepo} />);
    expect(
      screen.queryByRole("link", { name: "View Repository" })
    ).not.toBeInTheDocument();
  });

  it("renders as an article element for semantic HTML", () => {
    render(<ProjectDetail project={mockProject} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("renders section headings", () => {
    render(<ProjectDetail project={mockProject} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "About this project" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Technical Highlights" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Tech Stack" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Outcomes" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Screenshots" })
    ).toBeInTheDocument();
  });
});
