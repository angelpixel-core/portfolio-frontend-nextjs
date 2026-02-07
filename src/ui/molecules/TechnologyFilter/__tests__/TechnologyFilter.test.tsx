import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TechnologyFilter from "../index";

describe("TechnologyFilter", () => {
  const mockTechnologies = ["React", "TypeScript", "Next.js", "Tailwind CSS"];
  const mockOnToggle = jest.fn();
  const mockOnClearAll = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all technology chips", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={[]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    mockTechnologies.forEach((tech) => {
      expect(screen.getByRole("button", { name: tech })).toBeInTheDocument();
    });
  });

  it("marks selected technologies with aria-pressed", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={["React", "TypeScript"]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    expect(screen.getByRole("button", { name: "React" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "TypeScript" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    expect(screen.getByRole("button", { name: "Next.js" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("applies active class to selected chips", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={["React"]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    expect(screen.getByRole("button", { name: "React" })).toHaveClass(
      "tech-filter__chip--active"
    );
    expect(screen.getByRole("button", { name: "Next.js" })).not.toHaveClass(
      "tech-filter__chip--active"
    );
  });

  it("calls onToggle when chip is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={[]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "React" }));
    expect(mockOnToggle).toHaveBeenCalledWith("React");
  });

  it("calls onToggle when Enter key is pressed", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={[]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    const reactChip = screen.getByRole("button", { name: "React" });
    fireEvent.keyDown(reactChip, { key: "Enter" });
    expect(mockOnToggle).toHaveBeenCalledWith("React");
  });

  it("calls onToggle when Space key is pressed", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={[]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    const reactChip = screen.getByRole("button", { name: "React" });
    fireEvent.keyDown(reactChip, { key: " " });
    expect(mockOnToggle).toHaveBeenCalledWith("React");
  });

  it("shows Clear All button when filters are selected", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={["React", "TypeScript"]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    expect(
      screen.getByRole("button", { name: /clear all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /clear all/i })
    ).toHaveTextContent("Clear All (2)");
  });

  it("hides Clear All button when no filters selected", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={[]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    expect(
      screen.queryByRole("button", { name: /clear all/i })
    ).not.toBeInTheDocument();
  });

  it("calls onClearAll when Clear All button is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={["React"]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /clear all/i }));
    expect(mockOnClearAll).toHaveBeenCalled();
  });

  it("has accessible group role and label", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selected={[]}
        onToggle={mockOnToggle}
        onClearAll={mockOnClearAll}
      />
    );

    expect(
      screen.getByRole("group", { name: /filter by technology/i })
    ).toBeInTheDocument();
  });
});
