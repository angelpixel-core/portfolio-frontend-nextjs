"use client";

import React from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const isEnabled = (): boolean => {
  const raw = process.env.NEXT_PUBLIC_SPEED_INSIGHTS_ENABLED;
  if (!raw) return false;

  const normalized = raw.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
};

export default function PerformanceInsightsProvider(): React.JSX.Element | null {
  if (!isEnabled()) {
    return null;
  }

  return <SpeedInsights />;
}
