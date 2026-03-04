"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center"
    >
      <h2 className="text-2xl font-bold text-light">Something went wrong</h2>
      <p className="max-w-md text-gray-400">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/80"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-light transition-colors hover:bg-gray-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
