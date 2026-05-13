import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import subscriptionModel from "@/domains/subscription/model";
import { formatIdShort } from "@/lib/formatId";
import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";

export const metadata: Metadata = {
  title: "Admin subscriptions | Angel Pixel",
  description: "Operational subscription lifecycle management.",
};

const statusOptions = [
  "all",
  "pending_confirmation",
  "subscribed",
  "unsubscribed",
] as const;

type SearchParams = {
  status?: string;
};

type Props = {
  searchParams: Promise<SearchParams>;
};

const statusClassName = (status: string): string => {
  if (status === "subscribed") {
    return "bg-emerald-500/20 text-emerald-200 border border-emerald-300/30";
  }

  if (status === "unsubscribed") {
    return "bg-rose-500/20 text-rose-200 border border-rose-300/30";
  }

  return "bg-amber-500/20 text-amber-200 border border-amber-300/30";
};

const formatDateTime = (value: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
};

export default async function AdminSubscriptionsPage({
  searchParams,
}: Props): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.SUBSCRIPTIONS_MANAGE);

  const resolvedSearchParams = await searchParams;
  const requestedStatus = resolvedSearchParams.status;
  const isAllowedStatus = statusOptions.some(
    (item) => item === requestedStatus
  );
  const activeStatus =
    requestedStatus && isAllowedStatus ? requestedStatus : "all";

  const statusFilter =
    activeStatus === "all"
      ? undefined
      : (activeStatus as
          | "pending_confirmation"
          | "subscribed"
          | "unsubscribed");

  const [stats, rows] = await Promise.all([
    subscriptionModel.getAdminOverviewStats(),
    subscriptionModel.listForAdmin({
      limit: 300,
      status: statusFilter,
    }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-dark dark:text-light">
      <header>
        <h1 className="text-3xl font-semibold">Subscriptions</h1>
        <p className="mt-2 text-sm opacity-80">
          Internal view for subscriber lifecycle and manual recovery actions.
        </p>
      </header>

      <section className="mt-6 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Total
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.totalSubscriptions}
          </p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Pending
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.pendingSubscriptions}
          </p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Subscribed
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.subscribedSubscriptions}
          </p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Unsubscribed
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.unsubscribedSubscriptions}
          </p>
        </article>
      </section>

      <section className="mt-6 flex flex-wrap gap-2 text-sm">
        {statusOptions.map((status) => {
          const href =
            status === "all"
              ? "/admin/subscriptions"
              : `/admin/subscriptions?status=${status}`;
          const active = activeStatus === status;

          return (
            <Link
              key={status}
              href={href}
              className={`rounded-md border px-3 py-1.5 capitalize ${
                active
                  ? "border-dark/60 bg-dark/10 dark:border-light/60 dark:bg-light/10"
                  : "border-dark/25 dark:border-light/30"
              }`}
            >
              {status.replaceAll("_", " ")}
            </Link>
          );
        })}
      </section>

      {rows.length === 0 ? (
        <section className="mt-8 rounded-lg border border-dark/20 p-6 dark:border-light/20">
          <p className="text-base opacity-80">No subscriptions found.</p>
        </section>
      ) : (
        <section className="mt-8 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-dark/10 dark:bg-light/10">
              <tr>
                <th className="px-4 py-3 font-semibold">Subscription</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Article</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-dark/10 dark:border-light/10"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/admin/subscriptions/${row.id}`}
                      className="underline underline-offset-4"
                    >
                      {formatIdShort(row.id)}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${statusClassName(
                        row.status
                      )}`}
                    >
                      {row.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.source ?? "-"}</td>
                  <td className="px-4 py-3">{row.articleSlug ?? "-"}</td>
                  <td className="px-4 py-3">{formatDateTime(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/subscriptions/${row.id}`}
                      className="underline underline-offset-4"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}
