import { logger } from "@/lib/logger";
import {
  TwoFactorStatusSchema,
  type TwoFactorStatus,
} from "./schema";
import { twoFactorStatusMock } from "./mock";

interface FetchOptions {
  useMockFallback?: boolean;
}

const TwoFactor = {
  async fetchStatus({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<TwoFactorStatus> {
    try {
      const response = await fetch("/api/auth/2fa/status", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to fetch 2FA status");
      }

      const data = await response.json();
      return TwoFactorStatusSchema.parse(data);
    } catch (error) {
      if (useMockFallback) {
        return TwoFactorStatusSchema.parse(twoFactorStatusMock);
      }

      logger.error("TwoFactor", "fetchStatus failed", error);
      throw error;
    }
  },
};

export default TwoFactor;
