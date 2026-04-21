import React, { useEffect } from "react";
import { paymentOptions } from "./config";
import PaymentOption from "./PaymentOption";

interface PaymentModalProps {
  onClose: () => void;
}

export function PaymentModal({
  onClose,
}: PaymentModalProps): React.JSX.Element {
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onClose]);

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
            <PaymentOption key={option.id} option={option} />
          ))}
        </div>

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
