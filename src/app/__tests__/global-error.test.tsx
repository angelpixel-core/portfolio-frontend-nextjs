import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import GlobalError from "../global-error";

describe("Global Error Boundary (global-error.tsx)", () => {
  const mockReset = jest.fn();
  const mockError = new Error("Critical error");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders error heading", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);
    expect(
      screen.getByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument();
  });

  it("renders critical error description", () => {
    render(<GlobalError error={mockError} reset={mockReset} />);
    expect(screen.getByText(/a critical error occurred/i)).toBeInTheDocument();
  });

  it('calls reset when "Try again" is clicked', () => {
    render(<GlobalError error={mockError} reset={mockReset} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
