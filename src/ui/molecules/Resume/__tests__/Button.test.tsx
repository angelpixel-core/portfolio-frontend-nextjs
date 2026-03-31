import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Button from "../Button";
import { trackEvent } from "@/services/analytics";

const mockFetchResumeRequestStatus = jest.fn();
const mockOpenAuthPanel = jest.fn();
const mockOpenResumeRequest = jest.fn();
const mockSetResumeRequestIntent = jest.fn();

let authState = {
  isAuthenticated: false,
  openAuthPanel: mockOpenAuthPanel,
};

let resumeRequestState = {
  openResumeRequest: mockOpenResumeRequest,
  setResumeRequestIntent: mockSetResumeRequestIntent,
};

jest.mock("@/services/analytics", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("@/services/resumeRequest/api", () => ({
  fetchResumeRequestStatus: () => mockFetchResumeRequestStatus(),
}));

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => authState,
}));

jest.mock("@/state/slices/resumeRequestPanel/hooks", () => ({
  __esModule: true,
  default: () => resumeRequestState,
}));

describe("Resume CTA Button", () => {
  const mockTrackEvent = trackEvent as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    authState = {
      isAuthenticated: true,
      openAuthPanel: mockOpenAuthPanel,
    };
    resumeRequestState = {
      openResumeRequest: mockOpenResumeRequest,
      setResumeRequestIntent: mockSetResumeRequestIntent,
    };
  });

  it("renders a disabled Requested state when status is requested", async () => {
    mockFetchResumeRequestStatus.mockResolvedValue({
      ok: true,
      status: "requested",
    });

    render(<Button />);

    await waitFor(() => {
      const requestedButton = screen.getByRole("button", {
        name: /requested/i,
      });
      expect(requestedButton).toBeDisabled();
      fireEvent.click(requestedButton);
      expect(mockTrackEvent).not.toHaveBeenCalled();
    });
  });

  it("renders a disabled Sent state when status is sent", async () => {
    mockFetchResumeRequestStatus.mockResolvedValue({
      ok: true,
      status: "sent",
    });

    render(<Button />);

    await waitFor(() => {
      const sentButton = screen.getByRole("button", { name: /sent/i });
      expect(sentButton).toBeDisabled();
      fireEvent.click(sentButton);
      expect(mockTrackEvent).not.toHaveBeenCalled();
    });
  });

  it("renders an enabled Resume CTA when no request exists", async () => {
    mockFetchResumeRequestStatus.mockResolvedValue({ ok: true, status: null });

    render(<Button />);

    await waitFor(() => {
      const resumeButton = screen.getByRole("button", { name: /resume/i });
      expect(resumeButton).not.toBeDisabled();
    });
  });
});
