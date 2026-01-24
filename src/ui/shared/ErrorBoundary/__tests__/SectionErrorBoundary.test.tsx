import React from "react";
import { render, screen } from "@testing-library/react";
import { SectionErrorBoundary } from "../SectionErrorBoundary";

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Content rendered successfully</div>;
}

// Suppress console.error for expected errors in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalError;
});

describe("SectionErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <SectionErrorBoundary sectionName="Profile">
        <ThrowError shouldThrow={false} />
      </SectionErrorBoundary>
    );

    expect(
      screen.getByText("Content rendered successfully")
    ).toBeInTheDocument();
  });

  it("renders fallback UI when an error occurs", () => {
    render(
      <SectionErrorBoundary sectionName="Profile">
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(
      screen.queryByText("Content rendered successfully")
    ).not.toBeInTheDocument();
  });

  it("shows section name in the fallback message", () => {
    render(
      <SectionErrorBoundary sectionName="Profile">
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    );

    expect(screen.getByText(/profile/i)).toBeInTheDocument();
  });

  it("uses custom fallback when provided", () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <SectionErrorBoundary sectionName="Profile" fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </SectionErrorBoundary>
    );

    expect(screen.getByText("Custom error message")).toBeInTheDocument();
  });
});
