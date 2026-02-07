/**
 * Education Molecule Tests
 * Story 3.3: Academic Background
 * Story 3.4: Verification Links
 *
 * Refactored to match expandable details pattern.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useReducedMotion from hooks
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

// Mock TransitionerLi to simplify testing
jest.mock("@/atoms/hocs", () => ({
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

// Mock ChevronDownIcon
jest.mock("@/icons", () => ({
  ChevronDownIcon: ({ className }: { className?: string }) => (
    <svg data-testid="chevron-icon" className={className} />
  ),
}));

import Education from "../index";

describe("Education molecule", () => {
  const defaultProps = {
    id: 1,
    degree: "Bachelor Of Science in Information Systems",
    institution: "La Plata, Argentina (MIT)",
    start_date: "March 2013",
    end_date: "Dec 2017",
    resume:
      "The program equips individuals to lead software projects and develop information systems.",
  };

  it("renders degree correctly", () => {
    render(<Education {...defaultProps} />);

    expect(
      screen.getByText("Bachelor Of Science in Information Systems")
    ).toBeInTheDocument();
  });

  it("renders institution correctly", () => {
    render(<Education {...defaultProps} />);

    expect(screen.getByText("La Plata, Argentina (MIT)")).toBeInTheDocument();
  });

  it("renders time period correctly", () => {
    render(<Education {...defaultProps} />);

    expect(screen.getByText("March 2013 - Dec 2017")).toBeInTheDocument();
  });

  it("renders with proper heading structure", () => {
    render(<Education {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent(
      "Bachelor Of Science in Information Systems"
    );
  });

  it("renders toggle button when resume is provided", () => {
    render(<Education {...defaultProps} />);

    const toggleButton = screen.getByTestId("education-toggle");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });

  it("does not render toggle button when no resume or verification_url", () => {
    const propsWithoutDetails = {
      id: 2,
      degree: "Cloud Platform Practitioner",
      institution: "Amazon Web Services",
      start_date: "Nov 2020",
      end_date: "Dec 2020",
    };

    render(<Education {...propsWithoutDetails} />);

    expect(screen.queryByTestId("education-toggle")).not.toBeInTheDocument();
  });

  it("expands details when toggle is clicked", () => {
    render(<Education {...defaultProps} />);

    // Details should not be visible initially
    expect(screen.queryByTestId("education-details")).not.toBeInTheDocument();

    // Click toggle
    const toggleButton = screen.getByTestId("education-toggle");
    fireEvent.click(toggleButton);

    // Details should now be visible
    expect(screen.getByTestId("education-details")).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
  });

  it("shows resume text when expanded", () => {
    render(<Education {...defaultProps} />);

    // Click toggle to expand
    fireEvent.click(screen.getByTestId("education-toggle"));

    expect(
      screen.getByText(
        "The program equips individuals to lead software projects and develop information systems."
      )
    ).toBeInTheDocument();
  });

  it("collapses details on second click", () => {
    render(<Education {...defaultProps} />);

    const toggleButton = screen.getByTestId("education-toggle");

    // Expand
    fireEvent.click(toggleButton);
    expect(screen.getByTestId("education-details")).toBeInTheDocument();

    // Collapse
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("education-details")).not.toBeInTheDocument();
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
  });
});

describe("Education molecule - Story 3.4: verification links", () => {
  const certificationProps = {
    id: 2,
    degree: "Cloud Platform Practitioner",
    institution: "Amazon Web Services",
    start_date: "Nov 2020",
    end_date: "Dec 2020",
    verification_url: "https://www.credly.com/badges/aws-cloud-practitioner",
  };

  it("renders verification link when expanded", () => {
    render(<Education {...certificationProps} />);

    // Link should not be visible when collapsed
    expect(
      screen.queryByTestId("education-verification-link")
    ).not.toBeInTheDocument();

    // Expand details
    fireEvent.click(screen.getByTestId("education-toggle"));

    // Now link should be visible
    const link = screen.getByTestId("education-verification-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://www.credly.com/badges/aws-cloud-practitioner"
    );
  });

  it("verification link opens in new tab with rel noopener noreferrer", () => {
    render(<Education {...certificationProps} />);

    // Expand to show link
    fireEvent.click(screen.getByTestId("education-toggle"));

    const link = screen.getByTestId("education-verification-link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("verification link has aria-label for accessibility", () => {
    render(<Education {...certificationProps} />);

    // Expand to show link
    fireEvent.click(screen.getByTestId("education-toggle"));

    const link = screen.getByTestId("education-verification-link");
    expect(link).toHaveAttribute(
      "aria-label",
      "Verify Cloud Platform Practitioner credential"
    );
  });

  it("does not render verification link when verification_url is undefined", () => {
    const propsWithoutUrl = {
      id: 1,
      degree: "Bachelor Of Science",
      institution: "University",
      start_date: "2013",
      end_date: "2017",
      resume: "Some resume text",
    };

    render(<Education {...propsWithoutUrl} />);

    // Expand details
    fireEvent.click(screen.getByTestId("education-toggle"));

    expect(
      screen.queryByTestId("education-verification-link")
    ).not.toBeInTheDocument();
  });

  it("verification link displays correct text", () => {
    render(<Education {...certificationProps} />);

    // Expand to show link
    fireEvent.click(screen.getByTestId("education-toggle"));

    expect(screen.getByText("Verify credential")).toBeInTheDocument();
  });
});

describe("Education molecule - Accessibility", () => {
  const propsWithDetails = {
    id: 1,
    degree: "Test Degree",
    institution: "Test University",
    start_date: "2020",
    end_date: "2024",
    resume: "Resume text",
    verification_url: "https://example.com/verify",
  };

  it("toggle button has accessible label", () => {
    render(<Education {...propsWithDetails} />);

    const toggle = screen.getByTestId("education-toggle");
    expect(toggle).toHaveAttribute("aria-label", "Show details");
  });

  it("toggle button label changes when expanded", () => {
    render(<Education {...propsWithDetails} />);

    const toggle = screen.getByTestId("education-toggle");

    // Initially shows "Show details"
    expect(toggle).toHaveAttribute("aria-label", "Show details");

    // After expanding shows "Hide details"
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-label", "Hide details");
  });

  it("toggle controls details section via aria-controls", () => {
    render(<Education {...propsWithDetails} />);

    const toggle = screen.getByTestId("education-toggle");
    expect(toggle).toHaveAttribute("aria-controls", "education-details-1");

    // Expand to show details
    fireEvent.click(toggle);

    const details = screen.getByTestId("education-details");
    expect(details).toHaveAttribute("id", "education-details-1");
  });
});
