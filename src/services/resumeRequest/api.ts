export type ResumeRequestStatus = "requested" | "sent" | null;
export type ResumeRequestSource = "resume_cta" | "resume_intent";

export interface ResumeRequestStatusResponse {
  ok: boolean;
  status: ResumeRequestStatus;
}

export interface ResumeRequestSubmitResponse {
  ok: boolean;
  status: ResumeRequestStatus;
  error?: string;
}

export const fetchResumeRequestStatus = async (): Promise<ResumeRequestStatus> => {
  const response = await fetch("/api/resume-request", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 401) return null;

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ResumeRequestStatusResponse;
  return data.status ?? null;
};

export const submitResumeRequest = async (
  source: ResumeRequestSource
): Promise<ResumeRequestSubmitResponse> => {
  const response = await fetch("/api/resume-request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source }),
  });

  if (!response.ok) {
    const errorPayload = (await response.json().catch(() => null)) as
      | { error?: string; status?: ResumeRequestStatus }
      | null;
    return {
      ok: false,
      status: errorPayload?.status ?? null,
      error: errorPayload?.error ?? "unknown",
    };
  }

  const data = (await response.json()) as ResumeRequestSubmitResponse;
  return data;
};
