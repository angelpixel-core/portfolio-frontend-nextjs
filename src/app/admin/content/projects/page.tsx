import React from "react";
import type { Metadata } from "next";

import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";
import ProjectsAdminPanel from "./ProjectsAdminPanel";

export const metadata: Metadata = {
  title: "Admin content projects | Angel Pixel",
  description: "Manage project content.",
};

export default async function AdminContentProjectsPage(): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);

  return (
    <main className="text-dark dark:text-light">
      <header>
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="mt-2 text-sm opacity-80">
          Edit publication state, metadata, and ordering for portfolio projects.
        </p>
      </header>

      <section className="mt-6">
        <ProjectsAdminPanel />
      </section>
    </main>
  );
}
