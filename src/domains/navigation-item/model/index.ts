import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { NavigationItemsSchema, type NavigationItemsModel } from "./schema";

const ENDPOINT = "features";

interface FetchOptions {
  useMockFallback?: boolean;
}

const NavigationItem = {
  async fetchAll({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<NavigationItemsModel> {
    if (useMockFallback) {
      logger.mock("NavigationItem", "navigation items", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return NavigationItemsSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return NavigationItemsSchema.parse(data);
    } catch (error) {
      logger.error("NavigationItem", "fetchAll failed", error);
      throw error;
    }
  },
};

export default NavigationItem;
