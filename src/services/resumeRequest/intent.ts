import type { ResumeRequestIntent } from "@/state/slices/resumeRequestPanel";

export const RESUME_REQUEST_INTENT_KEY = "resume_request_intent";

export const loadResumeRequestIntent = (): ResumeRequestIntent | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RESUME_REQUEST_INTENT_KEY);
    if (!raw) return null;

    const intent: ResumeRequestIntent = JSON.parse(raw);
    if (!intent?.source || typeof intent.createdAt !== "number") {
      localStorage.removeItem(RESUME_REQUEST_INTENT_KEY);
      return null;
    }
    return intent;
  } catch {
    localStorage.removeItem(RESUME_REQUEST_INTENT_KEY);
    return null;
  }
};

export const saveResumeRequestIntent = (intent: ResumeRequestIntent): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(RESUME_REQUEST_INTENT_KEY, JSON.stringify(intent));
  } catch {
    // localStorage full or unavailable — fail silently
  }
};

export const clearResumeRequestIntent = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RESUME_REQUEST_INTENT_KEY);
  } catch {
    // fail silently
  }
};
