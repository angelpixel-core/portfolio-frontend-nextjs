import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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

import PlatformProjectExperience from "../PlatformProjectExperience";

describe("PlatformProjectExperience molecule", () => {
  it("hides role/year line and toggles details from dropdown", () => {
    render(
      <PlatformProjectExperience
        company="Zipline"
        companyLink="https://www.flyzipline.com"
        contextBadges={["Aerospace", "Drone Delivery"]}
        technologies={["Ruby", "AWS"]}
        work={[
          {
            description:
              "Real-time telemetry ingestion pipelines for autonomous drone logistics.",
          },
        ]}
      />
    );

    expect(
      screen.queryByText(/Selected Platform Project/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/ · /)).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("platform-project-details")
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /show details/i }));

    expect(screen.getByTestId("platform-project-details")).toBeInTheDocument();
    expect(
      screen.getByText(/Real-time telemetry ingestion pipelines/i)
    ).toBeInTheDocument();
  });
});
