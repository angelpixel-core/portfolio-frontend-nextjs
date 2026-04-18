import { logger } from "@/lib/logger";
import { authClient } from "@/lib/auth-client";
import { TwoFactorStatusSchema, type TwoFactorStatus } from "./schema";
import { twoFactorStatusMock } from "./mock";

interface FetchOptions {
  useMockFallback?: boolean;
}

const TwoFactor = {
  async fetchStatus({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<TwoFactorStatus> {
    try {
      const session = await authClient.getSession();
      const user = session?.data?.user ?? null;
      return TwoFactorStatusSchema.parse({
        enabled: Boolean(user?.twoFactorEnabled),
      });
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
