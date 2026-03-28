import React from "react";
import { render, waitFor } from "@testing-library/react";

import HireFlowController from "../HireFlowController";

const mockOpenHireFlow = jest.fn();
const mockCloseHireFlow = jest.fn();
const mockSetHireFlowIntent = jest.fn();
const mockClearHireFlowIntent = jest.fn();
const mockCloseAuthPanel = jest.fn();

const mockLoadHireFlowIntent = jest.fn();
const mockClearStoredHireFlowIntent = jest.fn();

let authState = {
  isOpen: false,
  isAuthenticated: false,
  closeAuthPanel: mockCloseAuthPanel,
};

let hireFlowState = {
  isOpen: false,
  pendingIntent: null as null | { source: string; createdAt: number },
  openHireFlow: mockOpenHireFlow,
  closeHireFlow: mockCloseHireFlow,
  setHireFlowIntent: mockSetHireFlowIntent,
  clearHireFlowIntent: mockClearHireFlowIntent,
};

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => authState,
}));

jest.mock("@/state/slices/hireFlowPanel/hooks", () => ({
  __esModule: true,
  default: () => hireFlowState,
}));

jest.mock("@/services/hireFlow/intent", () => ({
  loadHireFlowIntent: () => mockLoadHireFlowIntent(),
  clearHireFlowIntent: () => mockClearStoredHireFlowIntent(),
}));

describe("HireFlowController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authState = {
      isOpen: false,
      isAuthenticated: false,
      closeAuthPanel: mockCloseAuthPanel,
    };
    hireFlowState = {
      isOpen: false,
      pendingIntent: null,
      openHireFlow: mockOpenHireFlow,
      closeHireFlow: mockCloseHireFlow,
      setHireFlowIntent: mockSetHireFlowIntent,
      clearHireFlowIntent: mockClearHireFlowIntent,
    };
    mockLoadHireFlowIntent.mockReturnValue(null);
  });

  it("opens hire flow and clears intent after auth success", async () => {
    authState = {
      ...authState,
      isAuthenticated: true,
    };
    hireFlowState = {
      ...hireFlowState,
      pendingIntent: { source: "hire_me_header", createdAt: 123 },
    };

    render(<HireFlowController />);

    await waitFor(() => {
      expect(mockOpenHireFlow).toHaveBeenCalledTimes(1);
      expect(mockClearHireFlowIntent).toHaveBeenCalledTimes(1);
      expect(mockClearStoredHireFlowIntent).toHaveBeenCalledTimes(1);
    });
  });

  it("clears intent when auth closes without authentication", async () => {
    authState = {
      ...authState,
      isOpen: true,
      isAuthenticated: false,
    };
    hireFlowState = {
      ...hireFlowState,
      pendingIntent: { source: "hire_me_floating", createdAt: 456 },
    };

    const { rerender } = render(<HireFlowController />);

    authState = {
      ...authState,
      isOpen: false,
    };

    rerender(<HireFlowController />);

    await waitFor(() => {
      expect(mockClearHireFlowIntent).toHaveBeenCalledTimes(1);
      expect(mockClearStoredHireFlowIntent).toHaveBeenCalledTimes(1);
    });
  });
});
