"use client";

import React, { useState } from "react";

type OrderStatus = "pending" | "paid" | "failed";

type Props = {
  orderId: string;
  currentStatus: OrderStatus;
  currentEmail: string | null;
};

const statusOptions: OrderStatus[] = ["pending", "paid", "failed"];

export default function OrderActionsPanel({
  orderId,
  currentStatus,
  currentEmail,
}: Props): React.JSX.Element {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [email, setEmail] = useState(currentEmail ?? "");
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const runAction = async (
    action: "set_status" | "link_user" | "grant_access"
  ) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          status,
          email: email || undefined,
          reason: reason || undefined,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        setFeedback(`Failed: ${body.error ?? "unknown"}`);
        return;
      }

      setFeedback("Action completed. Refresh page to see latest state.");
    } catch {
      setFeedback("Failed: network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-lg border border-dark/20 p-4 dark:border-light/20">
      <h2 className="text-lg font-semibold">Manual actions</h2>
      <p className="mt-2 text-sm opacity-80">
        Use these controls only for operational recovery.
      </p>

      <div className="mt-4 grid gap-4">
        <label className="text-sm">
          <span className="mb-1 block opacity-80">Status</span>
          <select
            className="w-full rounded-md border border-dark/20 bg-transparent px-3 py-2 dark:border-light/20"
            value={status}
            onChange={(event) => setStatus(event.target.value as OrderStatus)}
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block opacity-80">Buyer email (optional)</span>
          <input
            type="email"
            className="w-full rounded-md border border-dark/20 bg-transparent px-3 py-2 dark:border-light/20"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="buyer@example.com"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block opacity-80">Reason</span>
          <input
            type="text"
            className="w-full rounded-md border border-dark/20 bg-transparent px-3 py-2 dark:border-light/20"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="manual recovery"
          />
        </label>

        <div className="flex flex-wrap gap-3 text-sm">
          <button
            type="button"
            className="rounded-md border border-dark/20 px-3 py-2 dark:border-light/20"
            disabled={submitting}
            onClick={() => runAction("set_status")}
          >
            Update status
          </button>
          <button
            type="button"
            className="rounded-md border border-dark/20 px-3 py-2 dark:border-light/20"
            disabled={submitting}
            onClick={() => runAction("link_user")}
          >
            Link user
          </button>
          <button
            type="button"
            className="rounded-md border border-dark/20 px-3 py-2 dark:border-light/20"
            disabled={submitting}
            onClick={() => runAction("grant_access")}
          >
            Grant access
          </button>
        </div>

        {feedback ? <p className="text-sm opacity-80">{feedback}</p> : null}
      </div>
    </section>
  );
}
