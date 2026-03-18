import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
}));

jest.mock("@/atoms/hocs", () => ({
  TransitionerLi: ({ children }: { children: React.ReactNode }) => (
    <li data-testid="transitioner-li">{children}</li>
  ),
}));

jest.mock("@/services/analytics", () => ({
  trackEvent: jest.fn(),
}));

import Experience from "../index";
import type { JobExperience } from "@/domains/job-experience/model";
import { trackEvent } from "@/services/analytics";

describe("Experience molecule", () => {
  const baseProps: Pick<
    JobExperience,
    | "id"
    | "position"
    | "company"
    | "companyLink"
    | "time"
    | "year"
    | "address"
    | "contextBadges"
    | "technologies"
    | "work"
  > = {
    id: 1,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    time: "Dec 2021 - Aug 2022",
    year: "2022",
    address: "New York, United States",
    contextBadges: ["PropTech", "Product Engineering"],
    technologies: ["TypeScript", "React", "GraphQL"],
    work: [
      {
        description: "Code maintenance and enhancement",
        tags: ["legacy-tag", "enhancement"],
      },
    ],
  };

  describe("company-first rendering", () => {
    it("renders company as primary card context with position secondary", () => {
      render(<Experience {...baseProps} />);

      const companyLink = screen.getByRole("link", { name: /Compass/i });
      const position = screen.getByRole("heading", {
        level: 3,
        name: /FullStack Engineer/i,
      });

      const companyBeforePosition =
        companyLink.compareDocumentPosition(position) &
        Node.DOCUMENT_POSITION_FOLLOWING;

      expect(companyBeforePosition).toBeTruthy();
    });

    it("renders metadata from explicit v2 fields", () => {
      render(<Experience {...baseProps} />);

      expect(
        screen.getByRole("heading", {
          level: 3,
          name: /FullStack Engineer/i,
        })
      ).toBeInTheDocument();
      expect(screen.getByText("2022")).toBeInTheDocument();
      expect(screen.getByText("PropTech")).toBeInTheDocument();
      expect(screen.getByText("Product Engineering")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("GraphQL")).toBeInTheDocument();
      expect(screen.getByText(/New York, United States/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Dec 2021 - Aug 2022/i)
      ).not.toBeInTheDocument();
    });

    it("keeps card readable with empty badges and technologies", () => {
      render(
        <Experience
          {...baseProps}
          company="Unknown Labs"
          contextBadges={[]}
          technologies={[]}
        />
      );

      expect(
        screen.queryByLabelText(/Context badges/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Technologies/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/N\/A|none|--/i)).not.toBeInTheDocument();

      expect(
        screen.getByRole("link", { name: /Unknown Labs/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { level: 3, name: /FullStack Engineer/i })
      ).toBeInTheDocument();
      expect(screen.getByText(/New York, United States/i)).toBeInTheDocument();
      expect(
        screen.queryByText(/Dec 2021 - Aug 2022/i)
      ).not.toBeInTheDocument();
    });

    it("renders technology chips only from technologies array", () => {
      render(<Experience {...baseProps} technologies={["React", "GraphQL"]} />);

      const technologies = screen.getByLabelText(/Technologies/i);

      expect(within(technologies).getByText("React")).toBeInTheDocument();
      expect(within(technologies).getByText("GraphQL")).toBeInTheDocument();
      expect(
        within(technologies).queryByText("legacy-tag")
      ).not.toBeInTheDocument();
    });

    it("does not backfill chips from work tags when technologies is empty", () => {
      render(
        <Experience
          {...baseProps}
          technologies={[]}
          work={[
            {
              description: "Legacy task",
              tags: ["legacy-tag", "work-only-tag"],
            },
          ]}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: /show details/i }));

      expect(screen.queryByLabelText(/Technologies/i)).not.toBeInTheDocument();
      expect(screen.queryByText("legacy-tag")).not.toBeInTheDocument();
      expect(screen.queryByText("work-only-tag")).not.toBeInTheDocument();
    });
  });

  describe("company link", () => {
    it("renders as external link with security attributes", () => {
      render(<Experience {...baseProps} />);

      const link = screen.getByRole("link", { name: /Compass/i });
      expect(link).toHaveAttribute("href", "https://compass.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("shows company logo preview on company name hover", () => {
      render(<Experience {...baseProps} />);

      const companyLink = screen.getByRole("link", { name: /Compass/i });

      expect(
        screen.queryByTestId("experience-company-logo-preview")
      ).not.toBeInTheDocument();

      fireEvent.mouseEnter(companyLink, { clientX: 120, clientY: 180 });
      expect(
        screen.getByTestId("experience-company-logo-preview")
      ).toBeInTheDocument();
      expect(screen.getByAltText(/Compass logo/i)).toBeInTheDocument();

      fireEvent.mouseLeave(companyLink);
      expect(
        screen.queryByTestId("experience-company-logo-preview")
      ).not.toBeInTheDocument();
    });
  });
});

describe("Experience molecule - expand and collapse", () => {
  const baseProps: Pick<
    JobExperience,
    | "id"
    | "position"
    | "company"
    | "companyLink"
    | "time"
    | "year"
    | "address"
    | "contextBadges"
    | "technologies"
    | "work"
  > = {
    id: 2,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    time: "Dec 2021 - Aug 2022",
    year: "2022",
    address: "New York, United States",
    contextBadges: ["PropTech"],
    technologies: ["TypeScript"],
    work: [
      {
        description: "Code maintenance and enhancement",
      },
      {
        description: "Database query optimization",
      },
    ],
  };

  it("toggles details visibility from show to hide", () => {
    render(<Experience {...baseProps} />);

    const button = screen.getByRole("button", { name: /show details/i });
    fireEvent.click(button);

    expect(
      screen.getByText(/Code maintenance and enhancement/i)
    ).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(screen.getByRole("button", { name: /hide details/i }));

    expect(
      screen.queryByText(/Code maintenance and enhancement/i)
    ).not.toBeInTheDocument();
  });

  it("tracks details expand event with section and label", () => {
    render(<Experience {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: /show details/i }));

    expect(trackEvent).toHaveBeenCalledWith("details_expand", {
      section: "experience",
      label: "Compass",
    });
  });

  it("renders expanded details before technologies", () => {
    render(<Experience {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: /show details/i }));

    const details = screen.getByTestId("experience-details");
    const technologies = screen.getByLabelText(/Technologies/i);
    const detailsBeforeTechnologies =
      details.compareDocumentPosition(technologies) &
      Node.DOCUMENT_POSITION_FOLLOWING;

    expect(detailsBeforeTechnologies).toBeTruthy();
  });

  it("hides toggle button when work items are missing", () => {
    render(<Experience {...baseProps} work={undefined} />);

    expect(
      screen.queryByRole("button", { name: /show details/i })
    ).not.toBeInTheDocument();
  });
});
