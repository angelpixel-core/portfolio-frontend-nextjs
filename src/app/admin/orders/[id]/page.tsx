import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";

import orderModel from "@/domains/order/model";
import { requireAdmin } from "@/lib/admin/requireAdmin";

import OrderActionsPanel from "./OrderActionsPanel";

type PageProps = {
  params: Promise<{ id: string }>;
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

export default async function AdminOrderDetailPage({
  params,
}: PageProps): Promise<React.JSX.Element> {
  await requireAdmin();
  const { id } = await params;
  const order = await orderModel.findAdminById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 text-dark dark:text-light">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] opacity-70">
            Order detail
          </p>
          <h1 className="mt-1 font-mono text-lg">{order.id}</h1>
        </div>
        <Link
          href="/admin/orders"
          className="text-sm underline underline-offset-4"
        >
          Back to orders
        </Link>
      </header>

      <section className="mt-6 rounded-lg border border-dark/20 p-4 dark:border-light/20">
        <dl className="grid gap-3 text-sm tablet:grid-cols-2">
          <div>
            <dt className="opacity-70">Status</dt>
            <dd className="font-semibold uppercase">{order.status}</dd>
          </div>
          <div>
            <dt className="opacity-70">Amount</dt>
            <dd className="font-semibold">
              {formatMoney(order.amount, order.currency)}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Product</dt>
            <dd>{order.productKey}</dd>
          </div>
          <div>
            <dt className="opacity-70">Provider</dt>
            <dd>{order.provider}</dd>
          </div>
          <div>
            <dt className="opacity-70">Buyer</dt>
            <dd>{order.email ?? "-"}</dd>
          </div>
          <div>
            <dt className="opacity-70">User</dt>
            <dd>{order.userEmail ?? "unlinked"}</dd>
          </div>
          <div>
            <dt className="opacity-70">Stripe Session</dt>
            <dd className="font-mono text-xs">
              {order.stripeSessionId ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Payment Intent</dt>
            <dd className="font-mono text-xs">
              {order.stripePaymentIntentId ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="opacity-70">Created</dt>
            <dd>{formatDateTime(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="opacity-70">Updated</dt>
            <dd>{formatDateTime(order.updatedAt)}</dd>
          </div>
        </dl>
      </section>

      <div className="mt-6">
        <OrderActionsPanel
          orderId={order.id}
          currentStatus={order.status}
          currentEmail={order.email}
        />
      </div>
    </main>
  );
}
