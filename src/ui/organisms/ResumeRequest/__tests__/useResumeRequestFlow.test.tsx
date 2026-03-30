import { renderHook, act } from "@testing-library/react";

import useResumeRequestFlow from "../useResumeRequestFlow";

describe("useResumeRequestFlow", () => {
  it("allows optional steps to be skipped", () => {
    const { result } = renderHook(() => useResumeRequestFlow());

    expect(result.current.stepIndex).toBe(0);
    expect(result.current.currentStep.id).toBe("context");

    act(() => {
      result.current.skipStep();
    });

    expect(result.current.stepIndex).toBe(1);
    expect(result.current.currentStep.id).toBe("role");

    act(() => {
      result.current.skipStep();
    });

    expect(result.current.stepIndex).toBe(2);
    expect(result.current.currentStep.id).toBe("notes");

    act(() => {
      result.current.skipStep();
    });

    expect(result.current.stepIndex).toBe(2);
    expect(result.current.answers).toEqual({});
  });

  it("retains answers when progressing with nextStep", () => {
    const { result } = renderHook(() => useResumeRequestFlow());

    act(() => {
      result.current.setAnswer("context", "Staffing for Q4 launch");
      result.current.nextStep();
    });

    expect(result.current.stepIndex).toBe(1);
    expect(result.current.answers).toEqual({
      context: "Staffing for Q4 launch",
    });

    act(() => {
      result.current.setAnswer("role", "Principal UX Engineer");
      result.current.nextStep();
    });

    expect(result.current.stepIndex).toBe(2);
    expect(result.current.answers).toEqual({
      context: "Staffing for Q4 launch",
      role: "Principal UX Engineer",
    });
  });
});
