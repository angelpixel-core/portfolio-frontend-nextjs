"use client";

import { useEffect, useRef } from "react";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useHireFlowPanel from "@/state/slices/hireFlowPanel/hooks";
import type { HireFlowIntent } from "@/state/slices/hireFlowPanel";
import {
  loadHireFlowIntent,
  clearHireFlowIntent as clearStoredHireFlowIntent,
} from "@/services/hireFlow/intent";

const restoreIntentFromUrl = (): HireFlowIntent | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const raw = params.get("hire_flow_intent") ?? params.get("hireFlowIntent");
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as HireFlowIntent;
    if (!parsed?.source || typeof parsed.createdAt !== "number") {
      return null;
    }

    params.delete("hire_flow_intent");
    params.delete("hireFlowIntent");
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

const HireFlowController = () => {
  const {
    isOpen: isHireFlowOpen,
    pendingIntent,
    openHireFlow,
    closeHireFlow,
    setHireFlowIntent,
    clearHireFlowIntent,
  } = useHireFlowPanel();
  const {
    isOpen: isAuthOpen,
    isAuthenticated,
    closeAuthPanel,
  } = useAuthPanel();
  const previousAuthOpenRef = useRef(isAuthOpen);
  const previousHireOpenRef = useRef(isHireFlowOpen);
  const restoredRef = useRef(false);

  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const urlIntent = restoreIntentFromUrl();
    if (urlIntent && !pendingIntent) {
      setHireFlowIntent(urlIntent);
      return;
    }

    const storedIntent = loadHireFlowIntent();
    if (storedIntent && !pendingIntent) {
      setHireFlowIntent(storedIntent);
    }
  }, [pendingIntent, setHireFlowIntent]);

  useEffect(() => {
    if (isAuthenticated && pendingIntent) {
      openHireFlow();
      clearHireFlowIntent();
      clearStoredHireFlowIntent();
    }
  }, [isAuthenticated, pendingIntent, openHireFlow, clearHireFlowIntent]);

  useEffect(() => {
    const wasOpen = previousAuthOpenRef.current;

    if (!wasOpen && isAuthOpen) {
      closeHireFlow();
    }

    if (wasOpen && !isAuthOpen && !isAuthenticated) {
      clearHireFlowIntent();
      clearStoredHireFlowIntent();
    }

    previousAuthOpenRef.current = isAuthOpen;
  }, [isAuthOpen, isAuthenticated, closeHireFlow, clearHireFlowIntent]);

  useEffect(() => {
    if (isHireFlowOpen && !previousHireOpenRef.current) {
      closeAuthPanel();
    }
    previousHireOpenRef.current = isHireFlowOpen;
  }, [isHireFlowOpen, closeAuthPanel]);

  return null;
};

export default HireFlowController;
