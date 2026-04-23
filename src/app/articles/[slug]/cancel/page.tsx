import React from "react";
import type { Metadata } from "next";

import CancelPage from "@/app/cancel/page";

export const metadata: Metadata = {
  title: "Payment cancelled | Angel Pixel",
  description: "Your payment was cancelled and no unlock was granted.",
};

export default function ArticleCancelPage(): React.JSX.Element {
  return <CancelPage />;
}
