import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import orderModel from "@/domains/order/model";
import { formatIdShort } from "@/lib/formatId";
import { requireAdmin } from "@/lib/admin/requireAdmin";

export const metadata: Metadata = {
  title: "Admin overview | Angel Pixel",
  description: "Operations summary for orders and access.",
};

const formatDateTime = (value: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
};

const formatMoney = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

export default async function AdminOverviewPage(): Promise<React.JSX.Element> {
  await requireAdmin();

  const stats = await orderModel.getAdminOverviewStats();
  const recentOrders = await orderModel.listForAdmin(10);

  return (
    <main className="text-dark dark:text-light">
      <header>
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="mt-2 text-sm opacity-80">
          Fast operational snapshot for payments, fulfillment, and anomalies.
        </p>
      </header>

      <section className="mt-6 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Total orders
          </p>
          <p className="mt-2 text-3xl font-semibold">{stats.totalOrders}</p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Paid orders
          </p>
          <p className="mt-2 text-3xl font-semibold">{stats.paidOrders}</p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Access grants
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {stats.totalAccessGrants}
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <h3 className="text-lg font-semibold">Needs attention</h3>
        <ul className="mt-3 space-y-2 text-sm opacity-90">
          <li>Unlinked paid orders: {stats.unlinkedPaidOrders}</li>
          <li>Pending orders: {stats.pendingOrders}</li>
          <li>Failed orders: {stats.failedOrders}</li>
        </ul>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent orders</h3>
          <Link
            href="/admin/orders"
            className="text-sm underline underline-offset-4"
          >
            Go to Orders
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-3 text-sm opacity-80">No recent orders.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-dark/10 dark:bg-light/10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Buyer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-dark/10 dark:border-light/10"
                  >
                    <td className="px-4 py-3 font-mono text-xs">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="underline underline-offset-4"
                      >
                        {formatIdShort(order.id)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 uppercase">{order.status}</td>
                    <td className="px-4 py-3">
                      {order.userEmail ?? order.email ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      {formatMoney(order.amount, order.currency)}
                    </td>
                    <td className="px-4 py-3">
                      {formatDateTime(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href="/admin/orders" className="underline underline-offset-4">
          Go to Orders
        </Link>
        <Link href="/admin/users" className="underline underline-offset-4">
          Go to Users
        </Link>
      </section>
    </main>
  );
}
