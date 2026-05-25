import type { ResumeRequestPayload } from "@/services/resumeRequest/schema";
import {
  fetchResumeRequestStatus,
  submitResumeRequest,
  type ResumeRequestStatus,
  type ResumeRequestStatusResponse,
  type ResumeRequestSubmitResponse,
} from "@/services/resumeRequest/api";

export type {
  ResumeRequestPayload,
  ResumeRequestStatus,
  ResumeRequestStatusResponse,
  ResumeRequestSubmitResponse,
};

export { fetchResumeRequestStatus, submitResumeRequest };
