import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

describe("Not Found (not-found.tsx)", () => {
  it("renders 404 heading", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/the page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
  });

  it('renders "Go home" link pointing to /', () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: /go home/i });
    expect(link).toHaveAttribute("href", "/");
  });
});
