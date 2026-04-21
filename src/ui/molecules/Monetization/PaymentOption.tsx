import React from "react";

import type { PaymentOptionType } from "./types";

interface PaymentOptionProps {
  option: PaymentOptionType;
}

export function PaymentOption({
  option,
}: PaymentOptionProps): React.JSX.Element {
  return (
    <button
      type="button"
      className={`monetization__payment-option ${
        option.enabled
          ? "monetization__payment-option--enabled"
          : "monetization__payment-option--disabled"
      }`.trim()}
      disabled={!option.enabled}
      aria-label={option.label}
    >
      <span className="monetization__payment-option-copy">
        <span className="monetization__payment-option-label">
          {option.label}
        </span>
        <span className="monetization__payment-option-description">
          {option.description}
        </span>
      </span>
      {!option.enabled ? (
        <span className="monetization__payment-option-state">Coming soon</span>
      ) : null}
    </button>
  );
}

export default PaymentOption;
