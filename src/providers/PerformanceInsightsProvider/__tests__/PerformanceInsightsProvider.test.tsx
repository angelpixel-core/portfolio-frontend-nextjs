import React from "react";
import { render, screen } from "@testing-library/react";

import PerformanceInsightsProvider from "../index";

jest.mock("@vercel/speed-insights/next", () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}));

describe("PerformanceInsightsProvider", () => {
  const originalValue = process.env.NEXT_PUBLIC_SPEED_INSIGHTS_ENABLED;

  afterEach(() => {
    if (originalValue === undefined) {
      delete process.env.NEXT_PUBLIC_SPEED_INSIGHTS_ENABLED;
    } else {
      process.env.NEXT_PUBLIC_SPEED_INSIGHTS_ENABLED = originalValue;
    }
  });

  it("does not render SpeedInsights when disabled", () => {
    process.env.NEXT_PUBLIC_SPEED_INSIGHTS_ENABLED = "false";

    const { container } = render(<PerformanceInsightsProvider />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId("speed-insights")).toBeNull();
  });

  it("renders SpeedInsights when enabled", () => {
    process.env.NEXT_PUBLIC_SPEED_INSIGHTS_ENABLED = "true";

    render(<PerformanceInsightsProvider />);

    expect(screen.getByTestId("speed-insights")).toBeInTheDocument();
  });
});
