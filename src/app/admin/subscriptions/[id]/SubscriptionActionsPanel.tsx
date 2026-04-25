"use client";

import React, { useState } from "react";

type Props = {
  subscriptionId: string;
};

export default function SubscriptionActionsPanel({
  subscriptionId,
}: Props): React.JSX.Element {
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const runAction = async (action: "resend_confirm" | "mark_unsubscribed") => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(
        `/api/admin/subscriptions/${subscriptionId}/actions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );

      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) {
        setFeedback(`Failed: ${body?.error ?? "unknown"}`);
        return;
      }

      if (action === "resend_confirm") {
        setFeedback("Confirmation email re-sent.");
        return;
      }

      setFeedback("Subscription marked as unsubscribed.");
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
        Use these controls for support recovery and lifecycle overrides.
      </p>

      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <button
          type="button"
          className="rounded-md border border-dark/20 px-3 py-2 dark:border-light/20"
          disabled={submitting}
          onClick={() => runAction("resend_confirm")}
        >
          Re-send confirm
        </button>
        <button
          type="button"
          className="rounded-md border border-dark/20 px-3 py-2 dark:border-light/20"
          disabled={submitting}
          onClick={() => runAction("mark_unsubscribed")}
        >
          Mark unsubscribed
        </button>
      </div>

      {feedback ? <p className="mt-3 text-sm opacity-80">{feedback}</p> : null}
    </section>
  );
}
