import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import orderModel from "@/domains/order/model";
import { formatIdShort } from "@/lib/formatId";
import { PERMISSIONS } from "@/application/authz";
import { requirePermission } from "@/lib/admin/requirePermission";

export const metadata: Metadata = {
  title: "Admin orders | Angel Pixel",
  description: "Internal order management overview.",
};

const formatMoney = (amount: number, currency: string): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount / 100);
};

const formatDateTime = (value: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
};

const getStatusClassName = (status: string): string => {
  if (status === "paid") {
    return "bg-emerald-500/20 text-emerald-200 border border-emerald-300/30";
  }

  if (status === "failed") {
    return "bg-rose-500/20 text-rose-200 border border-rose-300/30";
  }

  return "bg-amber-500/20 text-amber-200 border border-amber-300/30";
};

export default async function AdminOrdersPage(): Promise<React.JSX.Element> {
  await requirePermission(PERMISSIONS.ORDERS_MANAGE);
  const orders = await orderModel.listForAdmin(300);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-dark dark:text-light">
      <header>
        <h1 className="text-3xl font-semibold">Orders</h1>
        <p className="mt-2 text-sm opacity-80">
          Internal view for payment status, buyers, and product access flow.
        </p>
      </header>

      {orders.length === 0 ? (
        <section className="mt-8 rounded-lg border border-dark/20 p-6 dark:border-light/20">
          <p className="text-base opacity-80">No orders yet.</p>
        </section>
      ) : (
        <section className="mt-8 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-dark/10 dark:bg-light/10">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Buyer</th>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Provider</th>
                <th className="px-4 py-3 font-semibold">Created</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
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
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase ${getStatusClassName(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.productKey}</td>
                  <td className="px-4 py-3">
                    {formatMoney(order.amount, order.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <div>{order.email ?? "-"}</div>
                    {order.userEmail && order.userEmail !== order.email ? (
                      <div className="text-xs opacity-70">
                        acct: {order.userEmail}
                      </div>
                    ) : null}
                    {order.userName ? (
                      <div className="text-xs opacity-70">{order.userName}</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    {order.userId ? (
                      <Link
                        href={`/admin/users/${order.userId}`}
                        className="font-mono text-xs underline underline-offset-4"
                      >
                        {formatIdShort(order.userId)}
                      </Link>
                    ) : (
                      <span className="text-xs opacity-70">unlinked</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{order.provider}</td>
                  <td className="px-4 py-3">
                    {formatDateTime(order.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
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
