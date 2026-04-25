import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import subscriptionEventModel from "@/domains/subscription-event/model";
import subscriptionModel from "@/domains/subscription/model";
import { formatIdShort } from "@/lib/formatId";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import SubscriptionActionsPanel from "./SubscriptionActionsPanel";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata: Metadata = {
  title: "Admin subscription detail | Angel Pixel",
  description: "Subscription lifecycle detail and event audit.",
};

const formatDateTime = (value: Date | null): string => {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
};

export default async function AdminSubscriptionDetailPage({
  params,
}: Props): Promise<React.JSX.Element> {
  await requireAdmin();

  const { id } = await params;
  const [subscription, events] = await Promise.all([
    subscriptionModel.findById(id),
    subscriptionEventModel.listBySubscriptionId(id),
  ]);

  if (!subscription) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-dark dark:text-light">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Subscription detail
          </p>
          <h1 className="mt-1 font-mono text-lg">
            {formatIdShort(subscription.id)}
          </h1>
        </div>
        <Link
          href="/admin/subscriptions"
          className="text-sm underline underline-offset-4"
        >
          Back to subscriptions
        </Link>
      </header>

      <section className="mt-6 rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <h2 className="text-lg font-semibold">Snapshot</h2>
        <dl className="mt-4 grid gap-4 text-sm tablet:grid-cols-2 desktop:grid-cols-3">
          <div>
            <dt className="opacity-70">Email</dt>
            <dd>{subscription.email}</dd>
          </div>
          <div>
            <dt className="opacity-70">Status</dt>
            <dd className="uppercase">
              {subscription.status.replaceAll("_", " ")}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Source</dt>
            <dd>{subscription.source ?? "-"}</dd>
          </div>
          <div>
            <dt className="opacity-70">Article</dt>
            <dd>{subscription.articleSlug ?? "-"}</dd>
          </div>
          <div>
            <dt className="opacity-70">Created</dt>
            <dd>{formatDateTime(subscription.createdAt)}</dd>
          </div>
          <div>
            <dt className="opacity-70">Confirmed</dt>
            <dd>{formatDateTime(subscription.confirmedAt)}</dd>
          </div>
          <div>
            <dt className="opacity-70">Unsubscribed</dt>
            <dd>{formatDateTime(subscription.unsubscribedAt)}</dd>
          </div>
          <div>
            <dt className="opacity-70">Updated</dt>
            <dd>{formatDateTime(subscription.updatedAt)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6">
        <SubscriptionActionsPanel subscriptionId={subscription.id} />
      </section>

      <section className="mt-6 rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <h2 className="text-lg font-semibold">Audit events</h2>
        {events.length === 0 ? (
          <p className="mt-3 text-sm opacity-80">No events recorded.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-dark/10 dark:bg-light/10">
                <tr>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">When</th>
                  <th className="px-3 py-2 font-semibold">Payload</th>
                  <th className="px-3 py-2 font-semibold">Event</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-t border-dark/10 dark:border-light/10"
                  >
                    <td className="px-3 py-2 uppercase">{event.type}</td>
                    <td className="px-3 py-2">
                      {formatDateTime(event.createdAt)}
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs">{event.payload ?? "-"}</code>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs">
                      {formatIdShort(event.id)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
