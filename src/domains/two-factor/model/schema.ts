import { z } from "zod";

export const TwoFactorStatusSchema = z.object({
  enabled: z.boolean(),
  enrolledAt: z.string().optional(),
  lastVerifiedAt: z.string().optional(),
});

export const TwoFactorEnrollResponseSchema = z.object({
  otpauthUrl: z.string(),
  qrCodeDataUrl: z.string(),
  recoveryCodes: z.array(z.string()),
});

export const TwoFactorRecoveryCodesSchema = z.array(z.string());

export type TwoFactorStatus = z.infer<typeof TwoFactorStatusSchema>;
export type TwoFactorEnrollResponse = z.infer<
  typeof TwoFactorEnrollResponseSchema
>;
export type TwoFactorRecoveryCodes = z.infer<
  typeof TwoFactorRecoveryCodesSchema
>;
