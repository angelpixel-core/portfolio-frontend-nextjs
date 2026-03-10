"use client";

import React from "react";

import { useProfile } from "@/domains/profile/queries";

const Text = (): React.JSX.Element => {
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError || !profile) {
    return <>2024</>; // Fallback year
  }

  return <>{2026}</>;
};

export default Text;
