import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

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

    const section = screen.getByRole("region", { name: /academic/i });
    expect(section).toBeInTheDocument();

    const heading = screen.getByRole("heading", {
      level: 2,
      name: /academic/i,
    });
    expect(heading).toBeInTheDocument();
    expect(section).toHaveAttribute("aria-labelledby", heading.id);
  });
});
