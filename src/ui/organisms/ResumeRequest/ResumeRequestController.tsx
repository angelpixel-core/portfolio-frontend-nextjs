"use client";

import { useEffect, useRef } from "react";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useResumeRequestPanel from "@/state/slices/resumeRequestPanel/hooks";
import type { ResumeRequestIntent } from "@/state/slices/resumeRequestPanel";
import {
  loadResumeRequestIntent,
  clearResumeRequestIntent as clearStoredResumeRequestIntent,
} from "@/services/resumeRequest/intent";

const restoreIntentFromUrl = (): ResumeRequestIntent | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const raw =
    params.get("resume_request_intent") ?? params.get("resumeRequestIntent");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as ResumeRequestIntent;
    if (!parsed?.source || typeof parsed.createdAt !== "number") {
      return null;
    }

    params.delete("resume_request_intent");
    params.delete("resumeRequestIntent");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${
      query ? `?${query}` : ""
    }${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);

    return parsed;
  } catch {
    return null;
  }
};

const ResumeRequestController = () => {
  const {
    isOpen: isResumeRequestOpen,
    pendingIntent,
    openResumeRequest,
    closeResumeRequest,
    setResumeRequestIntent,
    clearResumeRequestIntent,
  } = useResumeRequestPanel();
  const {
    isOpen: isAuthOpen,
    isAuthenticated,
    closeAuthPanel,
  } = useAuthPanel();
  const previousAuthOpenRef = useRef(isAuthOpen);
  const previousResumeOpenRef = useRef(isResumeRequestOpen);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const urlIntent = restoreIntentFromUrl();
    if (urlIntent && !pendingIntent) {
      setResumeRequestIntent(urlIntent);
      return;
    }

    const storedIntent = loadResumeRequestIntent();
    if (storedIntent && !pendingIntent) {
      setResumeRequestIntent(storedIntent);
    }
  }, [pendingIntent, setResumeRequestIntent]);

  useEffect(() => {
    if (isAuthenticated && pendingIntent) {
      openResumeRequest(pendingIntent.source);
      clearResumeRequestIntent();
      clearStoredResumeRequestIntent();
    }
  }, [
    isAuthenticated,
    pendingIntent,
    openResumeRequest,
    clearResumeRequestIntent,
  ]);

  useEffect(() => {
    const wasOpen = previousAuthOpenRef.current;

    if (!wasOpen && isAuthOpen) {
      closeResumeRequest();
    }

    if (wasOpen && !isAuthOpen && !isAuthenticated) {
      clearResumeRequestIntent();
      clearStoredResumeRequestIntent();
    }

    previousAuthOpenRef.current = isAuthOpen;
  }, [
    isAuthOpen,
    isAuthenticated,
    closeResumeRequest,
    clearResumeRequestIntent,
  ]);

  useEffect(() => {
    if (isResumeRequestOpen && !previousResumeOpenRef.current) {
      closeAuthPanel();
    }
    previousResumeOpenRef.current = isResumeRequestOpen;
  }, [isResumeRequestOpen, closeAuthPanel]);

  return null;
};

export default ResumeRequestController;
