export type PaymentProviderId = "card" | "bitcoin" | "angelcoin";

export interface PaymentOptionType {
  id: PaymentProviderId;
  label: string;
  description: string;
  enabled: boolean;
  checkoutProductKey?: string;
  checkoutSource?: string;
}
