/**
 * Skeleton Component Tests
 * Story 5.1: Email Contact Access
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Skeleton from "../skeleton";

describe("Skeleton", () => {
  it("renders loading text", () => {
    render(<Skeleton />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("has aria-hidden for accessibility", () => {
    render(<Skeleton />);

    const skeleton = screen.getByText("Loading...");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("applies skeleton class for styling", () => {
    render(<Skeleton />);

    const skeleton = screen.getByText("Loading...");
    expect(skeleton).toHaveClass("email__link--skeleton");
  });
});
