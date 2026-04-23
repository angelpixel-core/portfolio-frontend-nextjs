import React from "react";
import type { Metadata } from "next";

import SuccessPage from "@/app/success/page";

type SearchParams = {
  order_id?: string | string[];
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = {
  title: "Payment status | Angel Pixel",
  description: "Review your payment result and unlock details.",
};

export default async function ArticleSuccessPage(
  props: PageProps
): Promise<React.JSX.Element> {
  return SuccessPage(props);
}
