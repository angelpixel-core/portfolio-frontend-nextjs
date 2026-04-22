import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import userModel from "@/domains/user/model";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin user detail | Angel Pixel",
  description: "Internal user orders and access details.",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

const getAdminAllowlist = (): Set<string> => {
  const raw = process.env.ADMIN_EMAILS ?? "";
  const values = raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return new Set(values);
};

const requireAdmin = async (): Promise<void> => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });
  const sessionEmail = session?.user?.email?.toLowerCase() ?? "";
  const adminAllowlist = getAdminAllowlist();

  if (!sessionEmail || !adminAllowlist.has(sessionEmail)) {
    redirect("/");
  }
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

export default async function AdminUserDetailPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  await requireAdmin();
  const { id } = await params;
  const detail = await userModel.getAdminDetailById(id, 300);

  if (!detail) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-dark dark:text-light">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] opacity-70">
            User detail
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{detail.user.email}</h1>
          <p className="mt-1 text-xs font-mono opacity-70">{detail.user.id}</p>
        </div>
        <Link href="/admin/users" className="underline underline-offset-4">
          Back to users
        </Link>
      </header>

      <section className="mt-8 grid gap-4 tablet:grid-cols-2 desktop:grid-cols-4">
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Orders
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {detail.stats.ordersCount}
          </p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">Paid</p>
          <p className="mt-2 text-3xl font-semibold">
            {detail.stats.paidOrdersCount}
          </p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Access grants
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {detail.stats.accessCount}
          </p>
        </article>
        <article className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Created
          </p>
          <p className="mt-2 text-sm">
            {formatDateTime(detail.user.createdAt)}
          </p>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Orders</h2>
        {detail.orders.length === 0 ? (
          <p className="mt-3 text-sm opacity-80">No orders for this user.</p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-dark/10 dark:bg-light/10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {detail.orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-dark/10 dark:border-light/10"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{order.id}</td>
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
                    <td className="px-4 py-3">{order.email ?? "-"}</td>
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

      <section className="mt-8">
        <h2 className="text-xl font-semibold">Access</h2>
        {detail.access.length === 0 ? (
          <p className="mt-3 text-sm opacity-80">
            No access grants for this user.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-dark/20 dark:border-light/20">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-dark/10 dark:bg-light/10">
                <tr>
                  <th className="px-4 py-3 font-semibold">Access ID</th>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Granted</th>
                </tr>
              </thead>
              <tbody>
                {detail.access.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-t border-dark/10 dark:border-light/10"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{entry.id}</td>
                    <td className="px-4 py-3">{entry.productKey}</td>
                    <td className="px-4 py-3">
                      {formatDateTime(entry.createdAt)}
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
