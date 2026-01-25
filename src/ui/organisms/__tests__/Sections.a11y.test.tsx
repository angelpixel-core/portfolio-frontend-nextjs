import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock hooks to avoid QueryClient dependency
jest.mock("@/hooks", () => ({
  useJobExperiences: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

// Mock academic domain hook (used directly by Academics component)
jest.mock("@/domains/academic", () => ({
  useAcademics: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

import Experiences from "../Experiences";
import Academics from "../Academics";

describe("Content section accessibility", () => {
  it("renders Experiences section with landmark and labelled heading", () => {
    render(<Experiences />);

    const section = screen.getByRole("region", { name: /experience/i });
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: /experience/i,
    });
    expect(heading).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
  });

  it("renders Academics section with landmark and labelled heading", () => {
    render(<Academics />);

    // Note: Component heading says "Education" but component is named "Academics"
    const section = screen.getByRole("region", { name: /education/i });
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: /education/i,
    });
    expect(heading).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
  });
});
