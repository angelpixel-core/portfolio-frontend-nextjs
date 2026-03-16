import { resolveContentSource } from "@/lib/content-source";
import { logger } from "@/lib/logger";
import { NavigationItemsSchema, type NavigationItemsModel } from "./schema";

const ENDPOINT = "features";
const ENV_KEY = "NEXT_PUBLIC_NAV_ITEMS";

interface FetchOptions {
  useMockFallback?: boolean;
}

const NavigationItem = {
  async fetchAll({
    useMockFallback: _useMockFallback = true,
  }: FetchOptions = {}): Promise<NavigationItemsModel> {
    try {
      return await resolveContentSource({
        envKey: ENV_KEY,
        schema: NavigationItemsSchema,
        endpoint: ENDPOINT,
      });
    } catch (error) {
      logger.error("NavigationItem", "fetchAll failed", error);
      throw error;
    }
  },
};

export default NavigationItem;
