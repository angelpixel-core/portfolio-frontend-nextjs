"use client";

import React, { useEffect, useState } from "react";

import { useProfile } from "@/domains/profile/queries";
import Skeleton from "./skeleton";

const Text = (): React.JSX.Element => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: profile, isLoading, isError } = useProfile(1);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <Skeleton />;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError || !profile) {
    return <>2024</>; // Fallback year
  }

  return <>{2026}</>;
};

export default Text;
