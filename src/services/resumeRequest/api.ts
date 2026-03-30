import { logger } from "@/lib/logger";
import type { ResumeRequestPayload } from "./schema";

export type ResumeRequestStatus = "requested" | "sent";

export type ResumeRequestStatusResponse =
  | { ok: true; status: ResumeRequestStatus | null }
  | { ok: false; error: "unauthenticated" | "provider_error" };

export type ResumeRequestSubmitResponse =
  | { ok: true; status: ResumeRequestStatus }
  | {
      ok: false;
      error:
        | "unauthenticated"
        | "already_requested"
        | "invalid"
        | "provider_error";
    };

const parseJson = async <T>(response: Response): Promise<T> => {
  try {
    return (await response.json()) as T;
  } catch {
    return { ok: false, error: "provider_error" } as T;
  }
};

export const fetchResumeRequestStatus =
  async (): Promise<ResumeRequestStatusResponse> => {
    try {
      const response = await fetch("/api/resume-request", {
        method: "GET",
      });

      return await parseJson<ResumeRequestStatusResponse>(response);
    } catch (error) {
      logger.error("ResumeRequest", "Failed to fetch status", error);
      return { ok: false, error: "provider_error" };
    }
  };

export const submitResumeRequest = async (
  payload: ResumeRequestPayload
): Promise<ResumeRequestSubmitResponse> => {
  try {
    const response = await fetch("/api/resume-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await parseJson<ResumeRequestSubmitResponse>(response);
  } catch (error) {
    logger.error("ResumeRequest", "Failed to submit request", error);
    return { ok: false, error: "provider_error" };
  }
};
