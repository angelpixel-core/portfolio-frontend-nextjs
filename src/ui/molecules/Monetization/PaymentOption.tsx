import React from "react";

import type { PaymentOptionType } from "./types";

interface PaymentOptionProps {
  option: PaymentOptionType;
  isLoading?: boolean;
  onSelect?: (_option: PaymentOptionType) => void;
}

export function PaymentOption({
  option,
  isLoading = false,
  onSelect,
}: PaymentOptionProps): React.JSX.Element {
  const isDisabled = !option.enabled || isLoading;

  return (
    <button
      type="button"
      className={`monetization__payment-option ${
        option.enabled
          ? "monetization__payment-option--enabled"
          : "monetization__payment-option--disabled"
      }`.trim()}
      disabled={isDisabled}
      aria-label={option.label}
      onClick={() => onSelect?.(option)}
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
      ) : isLoading ? (
        <span className="monetization__payment-option-state">
          Redirecting...
        </span>
      ) : null}
    </button>
  );
}

export default PaymentOption;
