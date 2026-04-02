import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import Button from "../Button";
import { trackEvent } from "@/services/analytics";
import {
  fetchResumeRequestStatus,
  submitResumeRequest,
} from "@/services/resumeRequest/api";
import {
  clearResumeRequestIntent,
  loadResumeRequestIntent,
  saveResumeRequestIntent,
} from "@/services/resumeRequest/intent";

const mockOpenAuthPanel = jest.fn();

let authState = {
  isAuthenticated: false,
  openAuthPanel: mockOpenAuthPanel,
};

jest.mock("@/services/analytics", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("@/services/resumeRequest/api", () => ({
  fetchResumeRequestStatus: jest.fn(),
  submitResumeRequest: jest.fn(),
}));

jest.mock("@/services/resumeRequest/intent", () => ({
  loadResumeRequestIntent: jest.fn(),
  saveResumeRequestIntent: jest.fn(),
  clearResumeRequestIntent: jest.fn(),
}));

jest.mock("@/domains/profile/queries", () => ({
  useProfile: () => ({
    data: { resume: "/resume" },
    isLoading: false,
    isError: false,
  }),
}));

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => authState,
}));

describe("Resume CTA", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authState = {
      isAuthenticated: false,
      openAuthPanel: mockOpenAuthPanel,
    };
    jest.spyOn(Date, "now").mockReturnValue(123);
    (fetchResumeRequestStatus as jest.Mock).mockResolvedValue(null);
    (submitResumeRequest as jest.Mock).mockResolvedValue({
      ok: true,
      status: "sent",
    });
    (loadResumeRequestIntent as jest.Mock).mockReturnValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("sets intent and opens auth when unauthenticated", async () => {
    render(<Button />);

    const cta = await screen.findByTestId("resume-request-cta");
    fireEvent.click(cta);

    expect(trackEvent).toHaveBeenCalledWith("cta_resume_click", {
      label: "resume",
      href: "resume_request",
    });
    expect(saveResumeRequestIntent).toHaveBeenCalledWith({
      source: "resume_cta",
      createdAt: 123,
    });
    expect(mockOpenAuthPanel).toHaveBeenCalledTimes(1);
    expect(submitResumeRequest).not.toHaveBeenCalled();
  });

  it("submits when authenticated", async () => {
    authState = { ...authState, isAuthenticated: true };

    render(<Button />);

    const cta = await screen.findByTestId("resume-request-cta");
    fireEvent.click(cta);

    await waitFor(() => {
      expect(submitResumeRequest).toHaveBeenCalledWith("resume_cta");
    });
  });

  it("renders requested state when status is requested", async () => {
    authState = { ...authState, isAuthenticated: true };
    (fetchResumeRequestStatus as jest.Mock).mockResolvedValue("requested");

    render(<Button />);

    const cta = await screen.findByTestId("resume-request-cta");

    await waitFor(() => {
      expect(cta).toBeDisabled();
      expect(cta).toHaveTextContent("CV Requested");
    });

    expect(clearResumeRequestIntent).not.toHaveBeenCalled();
  });
});
