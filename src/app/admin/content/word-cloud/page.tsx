import React from "react";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata: Metadata = {
  title: "Admin content word cloud | Angel Pixel",
  description: "Manage word cloud content.",
};

export default async function AdminContentWordCloudPage(): Promise<React.JSX.Element> {
  await requireAdmin();

  return (
    <main className="text-dark dark:text-light">
      <h2 className="text-2xl font-semibold">Word Cloud</h2>
      <p className="mt-2 text-sm opacity-80">
        This section is prepared in Phase 1. CRUD arrives in Phase 6.
      </p>
    </main>
  );
}
