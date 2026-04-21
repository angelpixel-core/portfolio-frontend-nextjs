import React, { useEffect, useState } from "react";
import { paymentOptions } from "./config";
import PaymentOption from "./PaymentOption";
import type { PaymentOptionType, PaymentProviderId } from "./types";

interface PaymentModalProps {
  onClose: () => void;
  onRedirect?: (_url: string) => void;
}

export const redirectToCheckout = (url: string): void => {
  window.location.assign(url);
};

export function PaymentModal({
  onClose,
  onRedirect = redirectToCheckout,
}: PaymentModalProps): React.JSX.Element {
  const [activeProvider, setActiveProvider] =
    useState<PaymentProviderId | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

  const handleSelectPayment = async (option: PaymentOptionType) => {
    if (!option.enabled || !option.checkoutProductKey) return;

    setSubmitError(null);
    setActiveProvider(option.id);

    try {
      const response = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productKey: option.checkoutProductKey,
          source: option.checkoutSource ?? "article-cta",
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.ok || !payload?.url) {
        throw new Error("checkout_init_failed");
      }

      onRedirect(payload.url);
    } catch {
      setSubmitError("Unable to start checkout. Please try again.");
      setActiveProvider(null);
    }
  };

  return (
    <div
      className="monetization__modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="monetization__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="monetization-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="monetization-modal-title" className="monetization__modal-title">
          Steal this pattern
        </h2>
        <p className="monetization__modal-description">
          Get the reusable implementation behind this article flow.
        </p>

        <div className="monetization__payment-grid">
          {paymentOptions.map((option) => (
            <PaymentOption
              key={option.id}
              option={option}
              isLoading={activeProvider === option.id}
              onSelect={handleSelectPayment}
            />
          ))}
        </div>

        {submitError ? (
          <p className="monetization__modal-error" role="status">
            {submitError}
          </p>
        ) : null}

        <button
          type="button"
          className="monetization__modal-close"
          onClick={onClose}
          aria-label="Close payment options"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;
