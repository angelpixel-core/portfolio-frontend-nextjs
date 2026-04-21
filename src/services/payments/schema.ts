import { z } from "zod";

export const CheckoutCreateSessionSchema = z.object({
  productKey: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254).optional(),
  source: z.string().trim().min(1).max(120).optional(),
});

export type CheckoutCreateSessionPayload = z.infer<
  typeof CheckoutCreateSessionSchema
>;
