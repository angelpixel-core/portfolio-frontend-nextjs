/**
 * Education Molecule Tests
 * Story 3.3: Academic Background
 */

import React from "react";
import { render, screen } from "@testing-library/react";
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
  TransitionerLi: ({
    children,
    data,
  }: {
    children: React.ReactNode;
    data: string;
  }) => (
    <li data-testid="transitioner-li" data-resume={data}>
      {children}
    </li>
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

    expect(screen.getByText(/La Plata, Argentina \(MIT\)/)).toBeInTheDocument();
  });

  it("renders time period correctly", () => {
    render(<Education {...defaultProps} />);

    expect(screen.getByText(/March 2013 - Dec 2017/)).toBeInTheDocument();
  });

  it("passes resume to TransitionerLi data prop", () => {
    render(<Education {...defaultProps} />);

    const transitionerLi = screen.getByTestId("transitioner-li");
    expect(transitionerLi).toHaveAttribute(
      "data-resume",
      "The program equips individuals to lead software projects and develop information systems."
    );
  });

  it("handles missing resume gracefully", () => {
    const propsWithoutResume = {
      id: 2,
      degree: "Cloud Platform Practitioner",
      institution: "Amazon Web Services",
      start_date: "Nov 2020",
      end_date: "Dec 2020",
    };

    render(<Education {...propsWithoutResume} />);

    const transitionerLi = screen.getByTestId("transitioner-li");
    expect(transitionerLi).toHaveAttribute("data-resume", "");
    expect(screen.getByText("Cloud Platform Practitioner")).toBeInTheDocument();
  });

  it("renders with proper heading structure", () => {
    render(<Education {...defaultProps} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent(
      "Bachelor Of Science in Information Systems"
    );
  });

  it("displays time and institution in history info span", () => {
    render(<Education {...defaultProps} />);

    const historyInfo = screen.getByText(
      /March 2013 - Dec 2017 \| La Plata, Argentina \(MIT\)/
    );
    expect(historyInfo).toBeInTheDocument();
    expect(historyInfo.tagName).toBe("SPAN");
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
    type: "certification" as const,
  };

  it("renders verification link when verification_url is provided", () => {
    render(<Education {...certificationProps} />);

    const link = screen.getByRole("link", { name: /verify/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://www.credly.com/badges/aws-cloud-practitioner"
    );
  });

  it("verification link opens in new tab with rel noopener noreferrer", () => {
    render(<Education {...certificationProps} />);

    const link = screen.getByRole("link", { name: /verify/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("verification link has aria-label for accessibility", () => {
    render(<Education {...certificationProps} />);

    const link = screen.getByRole("link", { name: /verify/i });
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
    };

    render(<Education {...propsWithoutUrl} />);

    expect(
      screen.queryByRole("link", { name: /verify/i })
    ).not.toBeInTheDocument();
  });

  it("verification link is keyboard accessible (is a focusable link)", () => {
    render(<Education {...certificationProps} />);

    const link = screen.getByRole("link", { name: /verify/i });
    // Link elements are naturally keyboard accessible
    expect(link.tagName).toBe("A");
    expect(link).not.toHaveAttribute("tabindex", "-1");
  });
});
