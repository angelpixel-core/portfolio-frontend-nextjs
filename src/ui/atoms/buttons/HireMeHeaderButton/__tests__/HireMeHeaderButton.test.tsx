import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import HireMeHeaderButton from "../index";
import { trackEvent } from "@/observability/analytics";
import { saveHireFlowIntent } from "@/application/intents/hireFlow";

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

jest.mock("@/application/intents/hireFlow", () => ({
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

describe("HireMeHeaderButton", () => {
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
    jest.spyOn(Date, "now").mockReturnValue(456);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the CTA", () => {
    render(<HireMeHeaderButton />);
    expect(
      screen.getByRole("button", { name: /hire me/i })
    ).toBeInTheDocument();
  });

  it("opens hire flow when authenticated", () => {
    authState = {
      ...authState,
      isAuthenticated: true,
    };

    render(<HireMeHeaderButton />);
    fireEvent.click(screen.getByRole("button", { name: /hire me/i }));

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
    render(<HireMeHeaderButton />);
    fireEvent.click(screen.getByRole("button", { name: /hire me/i }));

    expect(trackEvent).toHaveBeenCalledWith("cta_contact_click", {
      label: "hire me",
      href: "hire_flow",
    });
    expect(mockSetHireFlowIntent).toHaveBeenCalledWith({
      source: "hire_me_header",
      createdAt: 456,
    });
    expect(saveHireFlowIntent).toHaveBeenCalledWith({
      source: "hire_me_header",
      createdAt: 456,
    });
    expect(mockOpenAuthPanel).toHaveBeenCalledTimes(1);
    expect(mockOpenHireFlow).not.toHaveBeenCalled();
  });
});
