import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";
import articleAdminModel from "@/domains/article/model/admin";
import ArticleDetailPanel from "./ArticleDetailPanel";

export const metadata: Metadata = {
  title: "Admin article detail | Angel Pixel",
  description: "Edit article content blocks.",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminContentArticleDetailPage({
  params,
}: Props): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);

  const { id: idParam } = await params;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const article = await articleAdminModel.fetchById(id);
  if (!article) {
    notFound();
  }

  return (
    <main className="text-dark dark:text-light">
      <header className="flex flex-col gap-2">
        <Link href="/admin/content/articles" className="text-sm underline">
          ← Back to articles
        </Link>
        <h2 className="text-2xl font-semibold">Article detail</h2>
        <p className="text-sm opacity-80">
          Edit article metadata, hero image, and ordered content blocks.
        </p>
      </header>

      <section className="mt-6">
        <ArticleDetailPanel article={article} />
      </section>
    </main>
  );
}
