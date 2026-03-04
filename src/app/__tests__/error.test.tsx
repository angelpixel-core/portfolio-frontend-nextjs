import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);
import ErrorPage from "../error";

describe("Error Boundary (error.tsx)", () => {
  const mockReset = jest.fn();
  const mockError = new globalThis.Error("Test error");

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders error heading", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(
      screen.getByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument();
  });

  it("renders error description", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(
      screen.getByText(/an unexpected error occurred/i)
    ).toBeInTheDocument();
  });

  it('calls reset when "Try again" is clicked', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('renders "Go home" link pointing to /', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    const link = screen.getByRole("link", { name: /go home/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("logs the error to console", () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(console.error).toHaveBeenCalledWith(
      "🔴 [AppErrorBoundary]",
      "Unhandled route error",
      {
        digest: undefined,
        message: "Test error",
        name: "Error",
      }
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ErrorPage error={mockError} reset={mockReset} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
