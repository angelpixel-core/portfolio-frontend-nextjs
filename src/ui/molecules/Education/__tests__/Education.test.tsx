import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/atoms/hocs", () => ({
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

import Education from "../index";

describe("Education molecule", () => {
  it("renders degree, institution and year range without dropdown", () => {
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
    expect(screen.getByText("2013 - 2017")).toBeInTheDocument();
    expect(screen.queryByTestId("education-toggle")).not.toBeInTheDocument();
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

  it("renders AWS verification row with icon when verification_url exists", () => {
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
});
