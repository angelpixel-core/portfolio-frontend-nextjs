import React from "react";
import type { Metadata } from "next";

import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata: Metadata = {
  title: "Admin content job experiences | Angel Pixel",
  description: "Manage job experience entries.",
};

export default async function AdminContentJobExperiencesPage(): Promise<React.JSX.Element> {
  await requireAdmin();

  return (
    <main className="text-dark dark:text-light">
      <h2 className="text-2xl font-semibold">Job Experiences</h2>
      <p className="mt-2 text-sm opacity-80">
        This section is prepared in Phase 1. CRUD arrives in Phase 3.
      </p>
    </main>
  );
}
