import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock domain hook: useJobExperiences (default export from domain queries)
jest.mock("@/domains/job-experience/queries", () => ({
  __esModule: true,
  default: () => ({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

// Mock UI hooks from @/hooks barrel
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

// Mock academic domain hook (used directly by Academics component)
// Story 3.4: Must include data or component returns null (graceful empty state)
jest.mock("@/domains/academic", () => ({
  useAcademics: () => ({
    data: [
      {
        id: 1,
        degree: "Bachelor Of Science",
        institution: "University",
        start_date: "2013",
        end_date: "2017",
      },
    ],
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
