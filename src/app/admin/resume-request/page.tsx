import React from "react";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";

import { db } from "../../../db";
import { activity, user } from "../../../db/schema";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata: Metadata = {
  title: "Admin resume requested | Angel Pixel",
  description: "Operational view for resume request status.",
};

const ACTIVITY_TYPE = "request_resume";

const formatDateTime = (value: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
};

const statusClassName = (status: string): string => {
  if (status === "sent") {
    return "bg-emerald-500/20 text-emerald-200 border border-emerald-300/30";
  }

  if (status === "requested") {
    return "bg-amber-500/20 text-amber-200 border border-amber-300/30";
  }

  return "bg-slate-500/20 text-slate-200 border border-slate-300/30";
};

export default async function AdminResumeRequestPage(): Promise<React.JSX.Element> {
  await requireAdmin();

  const rows = await db
    .select({
      id: activity.id,
      status: activity.status,
      source: activity.source,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      userId: activity.userId,
      userEmail: user.email,
      userName: user.name,
    })
    .from(activity)
    .leftJoin(user, eq(activity.userId, user.id))
    .where(eq(activity.type, ACTIVITY_TYPE))
    .orderBy(desc(activity.createdAt))
    .limit(300);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-dark dark:text-light">
      <header>
        <h1 className="text-3xl font-semibold">Resume Requested</h1>
        <p className="mt-2 text-sm opacity-80">
          Internal operations timeline for resume request submissions.
        </p>
      </header>

      {rows.length === 0 ? (
        <section className="mt-8 rounded-lg border border-dark/20 p-6 dark:border-light/20">
          <p className="text-base opacity-80">No resume requests found.</p>
        </section>
      ) : (
        <section className="mt-8 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-dark/10 dark:bg-light/10">
              <tr>
                <th className="px-4 py-3 font-semibold">Request</th>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-dark/10 dark:border-light/10"
                >
                  <td className="px-4 py-3 font-mono text-xs">{row.id}</td>
                  <td className="px-4 py-3">
                    <div>{row.userEmail ?? "-"}</div>
                    <div className="text-xs opacity-70">
                      {row.userName ?? "-"}
                    </div>
                    <div className="font-mono text-xs opacity-60">
                      {row.userId}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusClassName(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.source}</td>
                  <td className="px-4 py-3">{formatDateTime(row.createdAt)}</td>
                  <td className="px-4 py-3">{formatDateTime(row.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
