import type { PaymentOptionType } from "./types";

export const paymentOptions: PaymentOptionType[] = [
  {
    id: "card",
    label: "Pay with Card",
    description: "Visa, Mastercard, and other major cards.",
    enabled: false,
  },
  {
    id: "bitcoin",
    label: "Pay with Bitcoin",
    description: "Crypto checkout via Bitcoin.",
    enabled: false,
  },
  {
    id: "angelcoin",
    label: "Pay with Angelcoin",
    description: "Token checkout coming soon.",
    enabled: false,
  },
];
