import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import HireMe from "../index";
import { trackEvent } from "@/observability/analytics";
import { saveHireFlowIntent } from "@/services/hireFlow/intent";

const mockOpenAuthPanel = jest.fn();
const mockOpenHireFlow = jest.fn();
const mockSetHireFlowIntent = jest.fn();

let authState = {
  isAuthenticated: false,
  openAuthPanel: mockOpenAuthPanel,
};

let hireFlowState = {
  openHireFlow: mockOpenHireFlow,
  setHireFlowIntent: mockSetHireFlowIntent,
};

jest.mock("@/observability/analytics", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("@/services/hireFlow/intent", () => ({
  saveHireFlowIntent: jest.fn(),
}));

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => authState,
}));

jest.mock("@/state/slices/hireFlowPanel/hooks", () => ({
  __esModule: true,
  default: () => hireFlowState,
}));

describe("HireMe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authState = {
      isAuthenticated: false,
      openAuthPanel: mockOpenAuthPanel,
    };
    hireFlowState = {
      openHireFlow: mockOpenHireFlow,
      setHireFlowIntent: mockSetHireFlowIntent,
    };
    jest.spyOn(Date, "now").mockReturnValue(789);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the CTA without profile data", () => {
    render(<HireMe />);
    expect(screen.getByTestId("hire-me-link")).toBeInTheDocument();
  });

  it("opens hire flow when authenticated", () => {
    authState = {
      ...authState,
      isAuthenticated: true,
    };

    render(<HireMe />);
    fireEvent.click(screen.getByTestId("hire-me-link"));

    expect(trackEvent).toHaveBeenCalledWith("cta_contact_click", {
      label: "hire me",
      href: "hire_flow",
    });
    expect(mockOpenHireFlow).toHaveBeenCalledTimes(1);
    expect(mockOpenAuthPanel).not.toHaveBeenCalled();
    expect(mockSetHireFlowIntent).not.toHaveBeenCalled();
    expect(saveHireFlowIntent).not.toHaveBeenCalled();
  });

  it("sets intent and opens auth when unauthenticated", () => {
    render(<HireMe />);
    fireEvent.click(screen.getByTestId("hire-me-link"));

    expect(trackEvent).toHaveBeenCalledWith("cta_contact_click", {
      label: "hire me",
      href: "hire_flow",
    });
    expect(mockSetHireFlowIntent).toHaveBeenCalledWith({
      source: "hire_me_floating",
      createdAt: 789,
    });
    expect(saveHireFlowIntent).toHaveBeenCalledWith({
      source: "hire_me_floating",
      createdAt: 789,
    });
    expect(mockOpenAuthPanel).toHaveBeenCalledTimes(1);
    expect(mockOpenHireFlow).not.toHaveBeenCalled();
  });
});
