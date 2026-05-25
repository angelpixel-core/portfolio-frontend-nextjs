import { render, fireEvent, waitFor, screen } from "@testing-library/react";

import ResumeRequestModal from "../ResumeRequestModal";
import { submitResumeRequest } from "@/application/resumeRequest";
import { getRecaptchaToken } from "@/lib/recaptcha";

jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

jest.mock("@/hooks/ui/useReducedMotion", () => ({
  useReducedMotion: () => false,
}));

jest.mock("@/application/resumeRequest", () => ({
  submitResumeRequest: jest.fn(),
}));

jest.mock("@/lib/recaptcha", () => ({
  getRecaptchaToken: jest.fn(),
}));

jest.mock("../useResumeRequestFlow", () => ({
  __esModule: true,
  default: () => ({
    steps: [
      {
        id: "context",
        title: "Request",
        subtitle: "",
        isOptional: true,
        render: () => <div>Step</div>,
      },
    ],
    stepIndex: 0,
    currentStep: {
      id: "context",
      title: "Request",
      subtitle: "",
      isOptional: true,
      render: () => <div>Step</div>,
    },
    answers: {},
    setAnswer: jest.fn(),
    nextStep: jest.fn(),
    previousStep: jest.fn(),
    skipStep: jest.fn(),
    resetFlow: jest.fn(),
    isFirstStep: true,
    isLastStep: true,
  }),
}));

describe("ResumeRequestModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("includes recaptcha token and action on submit", async () => {
    (getRecaptchaToken as jest.Mock).mockResolvedValue("token");
    (submitResumeRequest as jest.Mock).mockResolvedValue({
      ok: true,
      status: "sent",
    });

    render(
      <ResumeRequestModal isOpen onClose={jest.fn()} source="resume_cta" />
    );

    fireEvent.click(screen.getByText("Send request"));

    await waitFor(() => {
      expect(getRecaptchaToken).toHaveBeenCalledWith("resume_request");
    });

    expect(submitResumeRequest).toHaveBeenCalledWith({
      source: "resume_cta",
      recaptchaToken: "token",
      recaptchaAction: "resume_request",
    });
  });
});
