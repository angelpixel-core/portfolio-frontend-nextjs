import React from "react";
import type { Metadata } from "next";

import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";
import WordCloudAdminPanel from "./WordCloudAdminPanel";

export const metadata: Metadata = {
  title: "Admin content word cloud | Angel Pixel",
  description: "Manage word cloud content.",
};

export default async function AdminContentWordCloudPage(): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);

  return (
    <main className="text-dark dark:text-light">
      <header>
        <h2 className="text-2xl font-semibold">Word Cloud</h2>
        <p className="mt-2 text-sm opacity-80">
          Edit cloud concepts, weights, and related metadata used in the about
          page.
        </p>
      </header>

      <section className="mt-6">
        <WordCloudAdminPanel />
      </section>
    </main>
  );
}
