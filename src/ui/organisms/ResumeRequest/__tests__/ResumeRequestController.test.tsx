import React from "react";
import { render, waitFor } from "@testing-library/react";

import ResumeRequestController from "../ResumeRequestController";

const mockOpenResumeRequest = jest.fn();
const mockCloseResumeRequest = jest.fn();
const mockSetResumeRequestIntent = jest.fn();
const mockClearResumeRequestIntent = jest.fn();
const mockCloseAuthPanel = jest.fn();

const mockLoadResumeRequestIntent = jest.fn();
const mockClearStoredResumeRequestIntent = jest.fn();

let authState = {
  isOpen: false,
  isAuthenticated: false,
  closeAuthPanel: mockCloseAuthPanel,
};

let resumeRequestState = {
  isOpen: false,
  pendingIntent: null as null | {
    source: "resume_cta" | "resume_intent";
    createdAt: number;
  },
  openResumeRequest: mockOpenResumeRequest,
  closeResumeRequest: mockCloseResumeRequest,
  setResumeRequestIntent: mockSetResumeRequestIntent,
  clearResumeRequestIntent: mockClearResumeRequestIntent,
};

jest.mock("@/state/slices/authPanel/hooks", () => ({
  __esModule: true,
  default: () => authState,
}));

jest.mock("@/state/slices/resumeRequestPanel/hooks", () => ({
  __esModule: true,
  default: () => resumeRequestState,
}));

jest.mock("@/application/intents/resumeRequest", () => ({
  loadResumeRequestIntent: () => mockLoadResumeRequestIntent(),
  clearResumeRequestIntent: () => mockClearStoredResumeRequestIntent(),
}));

describe("ResumeRequestController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authState = {
      isOpen: false,
      isAuthenticated: false,
      closeAuthPanel: mockCloseAuthPanel,
    };
    resumeRequestState = {
      isOpen: false,
      pendingIntent: null,
      openResumeRequest: mockOpenResumeRequest,
      closeResumeRequest: mockCloseResumeRequest,
      setResumeRequestIntent: mockSetResumeRequestIntent,
      clearResumeRequestIntent: mockClearResumeRequestIntent,
    };
    mockLoadResumeRequestIntent.mockReturnValue(null);
  });

  it("opens resume request after auth success with intent", async () => {
    authState = {
      ...authState,
      isAuthenticated: true,
    };
    resumeRequestState = {
      ...resumeRequestState,
      pendingIntent: { source: "resume_intent", createdAt: 123 },
    };

    render(<ResumeRequestController />);

    await waitFor(() => {
      expect(mockOpenResumeRequest).toHaveBeenCalledTimes(1);
      expect(mockClearResumeRequestIntent).toHaveBeenCalledTimes(1);
      expect(mockClearStoredResumeRequestIntent).toHaveBeenCalledTimes(1);
    });
  });

  it("does not open resume request without intent", async () => {
    authState = {
      ...authState,
      isAuthenticated: true,
    };

    render(<ResumeRequestController />);

    await waitFor(() => {
      expect(mockOpenResumeRequest).not.toHaveBeenCalled();
      expect(mockClearResumeRequestIntent).not.toHaveBeenCalled();
    });
  });
});
