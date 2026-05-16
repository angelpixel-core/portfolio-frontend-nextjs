import React from "react";
import type { Metadata } from "next";

import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";
import ArticlesAdminPanel from "./ArticlesAdminPanel";

export const metadata: Metadata = {
  title: "Admin content articles | Angel Pixel",
  description: "Manage article content.",
};

export default async function AdminContentArticlesPage(): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);

  return (
    <main className="text-dark dark:text-light">
      <header>
        <h2 className="text-2xl font-semibold">Articles</h2>
        <p className="mt-2 text-sm opacity-80">
          Edit publication state and article metadata for the public blog list.
        </p>
      </header>

      <section className="mt-6">
        <ArticlesAdminPanel />
      </section>
    </main>
  );
}
