import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/atoms/hocs", () => ({
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

jest.mock("@/services/analytics", () => ({
  trackEvent: jest.fn(),
}));

import Education from "../index";
import { trackEvent } from "@/services/analytics";

describe("Education molecule", () => {
  it("renders degree, institution and year with toggle", () => {
    render(
      <Education
        id={1}
        degree="B.Sc. in Information Systems"
        institution="National University of La Plata"
        start_date="2013"
        end_date="2017"
      />
    );

    expect(
      screen.getByText("B.Sc. in Information Systems")
    ).toBeInTheDocument();
    expect(
      screen.getByText("National University of La Plata")
    ).toBeInTheDocument();
    expect(screen.getByText("·")).toBeInTheDocument();
    expect(screen.getByText("2017")).toBeInTheDocument();
    expect(screen.getByTestId("education-toggle")).toBeInTheDocument();
    expect(screen.queryByTestId("education-details")).not.toBeInTheDocument();
  });

  it("renders single year when start and end are equal", () => {
    render(
      <Education
        id={2}
        degree="AWS Certified Cloud Practitioner"
        institution="Amazon Web Services"
        start_date="2020"
        end_date="2020"
        verification_url="https://www.credly.com/badges/aws-cloud-practitioner"
      />
    );

    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.queryByText("2020 - 2020")).not.toBeInTheDocument();
  });

  it("renders AWS verification row with icon when expanded", () => {
    render(
      <Education
        id={2}
        degree="AWS Certified Cloud Practitioner"
        institution="Amazon Web Services"
        start_date="2020"
        end_date="2020"
        verification_url="https://www.credly.com/badges/aws-cloud-practitioner"
      />
    );

    const toggle = screen.getByTestId("education-toggle");
    expect(toggle).toBeInTheDocument();

    expect(
      screen.queryByTestId("education-verification-link")
    ).not.toBeInTheDocument();

    fireEvent.click(toggle);

    const link = screen.getByTestId("education-verification-link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveTextContent("Verify Credentials");
    expect(
      screen.getByTestId("education-verification-aws-icon")
    ).toBeInTheDocument();
    expect(link).toHaveAttribute(
      "href",
      "https://www.credly.com/badges/aws-cloud-practitioner"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("tracks details expand event with section and label", () => {
    render(
      <Education
        id={3}
        degree="B.Sc. in Information Systems"
        institution="National University of La Plata"
        start_date="2013"
        end_date="2017"
      />
    );

    fireEvent.click(screen.getByTestId("education-toggle"));

    expect(trackEvent).toHaveBeenCalledWith("details_expand", {
      section: "education",
      label: "National University of La Plata",
    });
  });
});
