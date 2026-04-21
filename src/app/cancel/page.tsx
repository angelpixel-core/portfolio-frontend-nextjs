import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment cancelled | Angel Pixel",
  description: "Your payment was cancelled and no unlock was granted.",
};

export default function CancelPage(): React.JSX.Element {
  return (
    <main className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="text-3xl font-semibold">Payment cancelled</h1>
      <p className="mt-4 text-base opacity-80">
        No charge was confirmed and no unlock was granted.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/articles/why-portfolio-not-convert" className="underline">
          Back to checkout article
        </Link>
        <Link href="/articles" className="underline">
          Browse articles
        </Link>
      </div>
    </main>
  );
}
