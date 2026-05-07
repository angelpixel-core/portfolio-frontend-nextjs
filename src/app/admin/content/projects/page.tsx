import React from "react";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata: Metadata = {
  title: "Admin content projects | Angel Pixel",
  description: "Manage project content.",
};

export default async function AdminContentProjectsPage(): Promise<React.JSX.Element> {
  await requireAdmin();

  return (
    <main className="text-dark dark:text-light">
      <h2 className="text-2xl font-semibold">Projects</h2>
      <p className="mt-2 text-sm opacity-80">
        This section is prepared in Phase 1. CRUD arrives in Phase 4.
      </p>
    </main>
  );
}
