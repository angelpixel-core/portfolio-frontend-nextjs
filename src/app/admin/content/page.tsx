import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata: Metadata = {
  title: "Admin content dashboard | Angel Pixel",
  description: "Editorial control center for public site content.",
};

const contentAreas = [
  {
    href: "/admin/content/profile",
    title: "Profile",
    description: "Public profile, contact channels, and social links.",
  },
  {
    href: "/admin/content/job-experiences",
    title: "Job experiences",
    description:
      "Career timeline entries shown in the site experience section.",
  },
  {
    href: "/admin/content/projects",
    title: "Projects",
    description: "Portfolio project cards, ordering, and publication state.",
  },
  {
    href: "/admin/content/articles",
    title: "Articles",
    description: "Article metadata, publication state, and catalog updates.",
  },
  {
    href: "/admin/content/word-cloud",
    title: "Word cloud",
    description: "Keyword terms, weighting, and curated vocabulary.",
  },
] as const;

export default async function AdminContentPage(): Promise<React.JSX.Element> {
  await requireAdmin();

  return (
    <main className="text-dark dark:text-light">
      <header>
        <h2 className="text-2xl font-semibold">Content Overview</h2>
        <p className="mt-2 text-sm opacity-80">
          Manage all public-facing content domains from a dedicated editorial
          workspace.
        </p>
      </header>

      <section className="mt-6 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        {contentAreas.map((area) => (
          <Link
            key={area.href}
            href={area.href}
            className="rounded-lg border border-dark/20 p-4 dark:border-light/20"
          >
            <h3 className="text-lg font-semibold">{area.title}</h3>
            <p className="mt-2 text-sm opacity-80">{area.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
