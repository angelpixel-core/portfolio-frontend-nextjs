import type { HireFlowIntent } from "@/state/slices/hireFlowPanel";

export const HIRE_FLOW_INTENT_KEY = "hire_flow_intent";

export const loadHireFlowIntent = (): HireFlowIntent | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(HIRE_FLOW_INTENT_KEY);
    if (!raw) return null;

    const intent: HireFlowIntent = JSON.parse(raw);
    if (!intent?.source || typeof intent.createdAt !== "number") {
      localStorage.removeItem(HIRE_FLOW_INTENT_KEY);
      return null;
    }
    return intent;
  } catch {
    localStorage.removeItem(HIRE_FLOW_INTENT_KEY);
    return null;
  }
};

export const saveHireFlowIntent = (intent: HireFlowIntent): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HIRE_FLOW_INTENT_KEY, JSON.stringify(intent));
  } catch {
    // localStorage full or unavailable — fail silently
  }
};

export const clearHireFlowIntent = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HIRE_FLOW_INTENT_KEY);
  } catch {
    // fail silently
  }
};
